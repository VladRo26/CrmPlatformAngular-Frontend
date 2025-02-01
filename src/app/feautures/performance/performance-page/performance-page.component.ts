import { Component, inject, Input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { AccountService } from '../../../_services/account.service';
import { TicketService } from '../../../_services/ticket.service';
import { OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FeedbackService } from '../../../_services/feedback.service';
import { AverageFeedbackSentiment } from '../../../_models/averagefeedbacksentiment';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-performance-page',
  standalone: true,
  imports: [ChartModule,NgIf,CardModule],
  templateUrl: './performance-page.component.html',
  styleUrl: './performance-page.component.css'
})
export class PerformancePageComponent implements OnInit {
  @Input() username!: string; // Input property for username

  ticketService = inject(TicketService);
  feedbackService = inject(FeedbackService);

  noSentimentDataMessage: string = ""; // ✅ Holds the no-data message for the sentiment chart

  basicData: any; // Chart.js data
  basicOptions: any; // Chart.js options
  sentimentData: any; // Pie Chart Data for Sentiment
  sentimentOptions: any; // Pie Chart Options
  ticketGroupChartData: any; // New Horizontal Bar Chart Data
  ticketGroupChartOptions: any;
  loading: boolean = true; // Loading state for the chart data

 
  ngOnInit(): void {
    if (this.username) {
      this.loadPerformanceData();
      this.loadSentimentData();  // Load sentiment data
      this.loadTicketGroupingData();

    } else {
      console.error('Username is required for PerformancePageComponent.');
    }
  }


  private loadPerformanceData(): void {
    this.ticketService.getTicketPerformance(this.username).subscribe({
      next: (data) => {
        if (data && data.totalTickets > 0) {
          this.createChartData(data);
        } else {
          console.warn("No ticket performance data available.");
          this.basicData = { datasets: [] }; // Prevent chart errors, trigger no-data message
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching performance data:', err);
        this.basicData = { datasets: [] }; // Prevent chart errors, trigger no-data message
        this.loading = false;
      }
    });
  }

  private loadSentimentData(): void {
    this.feedbackService.getAverageSentimentByUsername(this.username).subscribe({
      next: (sentiment: AverageFeedbackSentiment) => { 
        if (!sentiment || (sentiment.positive === 0 && sentiment.neutral === 0 && sentiment.negative === 0)) {
          console.warn("No sentiment data available.");
          this.sentimentData = null; // ✅ No chart data
          this.noSentimentDataMessage = "No sentiment data available for this user."; // ✅ Show message
          return;
        }

        this.noSentimentDataMessage = ""; // ✅ Clear message if data exists
        this.createSentimentChartData(sentiment);
      },
      error: (err) => {
        console.error('Error fetching sentiment data:', err);
        this.sentimentData = null;
        this.noSentimentDataMessage = "Error retrieving sentiment data.";
      }
    });
}



  private loadTicketGroupingData(): void {
    this.ticketService.getTicketsGroupedByBeneficiaryCompany(this.username).subscribe({
      next: (response) => {
        if (!response || !Array.isArray(response) || response.length === 0) {
          console.warn('No grouped ticket data available:', response);
          this.ticketGroupChartData = { datasets: [] }; // Prevent empty chart errors, trigger message
          return;
        }
        this.createGroupedTicketChartData(response);
      },
      error: (err) => {
        console.error('Error fetching grouped ticket data:', err);
        this.ticketGroupChartData = { datasets: [] }; // Prevent empty chart errors, trigger message
      }
    });
  }
  
  

  
private createChartData(data: { username: string; totalTickets: number; resolvedTickets: number; unresolvedTickets: number; ticketsByPriority: { [key: string]: number }; }): void {
  if (!data || data.totalTickets === 0) {
    this.basicData = null;
    return;
  }

  this.basicData = {
    labels: ['Total Tickets', 'Resolved Tickets', 'Unresolved Tickets', ...Object.keys(data.ticketsByPriority)],
    datasets: [{
      label: 'Ticket Statistics',
      backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043', '#AB47BC'],
      data: [
        data.totalTickets,
        data.resolvedTickets,
        data.unresolvedTickets,
        ...Object.values(data.ticketsByPriority)
      ]
    }]
  };

  this.basicOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`
        }
      }
    },
    scales: {
      x: { display: true, title: { display: true, text: 'Categories' } },
      y: {
        display: true,
        title: { display: true, text: 'Number of Tickets' },
        beginAtZero: true,
        ticks: { callback: (value: number) => (Number.isInteger(value) ? value : ''), stepSize: 1 }
      }
    }
  };
}

  
private createSentimentChartData(data: AverageFeedbackSentiment): void {
  if (!data || (data.positive === 0 && data.neutral === 0 && data.negative === 0)) {
    this.sentimentData = null;
    return;
  }

  this.sentimentData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [{
      data: [data.positive, data.neutral, data.negative],
      backgroundColor: ['#66BB6A', '#FFA726', '#FF7043']
    }]
  };

  this.sentimentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => `${tooltipItem.label}: ${(tooltipItem.raw * 100).toFixed(2)}%`
        }
      }
    }
  };
}

private createGroupedTicketChartData(data: any[]): void {
  if (!data || data.length === 0) {
    this.ticketGroupChartData = null;
    return;
  }

  const companyNames = data.map(item => item.beneficiaryCompanyName);
  const ticketStatuses = [...new Set(data.flatMap(company => company.ticketsByStatus.map((status: { status: any; }) => status.status)))];

  const datasets = ticketStatuses.map(status => ({
    label: status,
    data: data.map(company => {
      const statusEntry = company.ticketsByStatus.find((s: { status: any; }) => s.status === status);
      return statusEntry ? statusEntry.count : 0;
    }),
    backgroundColor: this.getRandomColor(),
  }));

  this.ticketGroupChartData = {
    labels: companyNames,
    datasets: datasets
  };

  this.ticketGroupChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`
        }
      }
    },
    scales: {
      x: { beginAtZero: true },
      y: { ticks: { autoSkip: false } }
    }
  };
}
  private getRandomColor(): string {
    const colors = ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043', '#AB47BC'];
    return colors[Math.floor(Math.random() * colors.length)];
  }


  
}
