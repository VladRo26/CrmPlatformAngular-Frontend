import { Component, inject, Input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { AccountService } from '../../../_services/account.service';
import { TicketService } from '../../../_services/ticket.service';
import { OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FeedbackService } from '../../../_services/feedback.service';
import { AverageFeedbackSentiment } from '../../../_models/averagefeedbacksentiment';

@Component({
  selector: 'app-performance-page',
  standalone: true,
  imports: [ChartModule,NgIf],
  templateUrl: './performance-page.component.html',
  styleUrl: './performance-page.component.css'
})
export class PerformancePageComponent implements OnInit {
  @Input() username!: string; // Input property for username

  ticketService = inject(TicketService);
  feedbackService = inject(FeedbackService);

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
    if (!this.username) {
      console.error('Username is not set.');
      return;
    }

    this.ticketService.getTicketPerformance(this.username).subscribe({
      next: (data) => {
        this.createChartData(data);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching performance data:', err);
        this.loading = false;
      }
    });
  }

  private loadSentimentData(): void {
    this.feedbackService.getAverageSentimentByUsername(this.username).subscribe({
      next: (data) => {
        this.createSentimentChartData(data);
      },
      error: (err) => {
        console.error('Error fetching sentiment data:', err);
      }
    });
  }

  private loadTicketGroupingData(): void {
    this.ticketService.getTicketsGroupedByBeneficiaryCompany(this.username).subscribe({
      next: (data) => {
        this.createGroupedTicketChartData(data);
      },
      error: (err) => {
        console.error('Error fetching grouped ticket data:', err);
      }
    });
  }

  private createChartData(data: {
    username: string;
    totalTickets: number;
    resolvedTickets: number;
    unresolvedTickets: number;
    ticketsByPriority: { [key: string]: number };
  }): void {
    // Prepare data for the chart
    this.basicData = {
      labels: ['Total Tickets', 'Resolved Tickets', 'Unresolved Tickets', ...Object.keys(data.ticketsByPriority)],
      datasets: [
        {
          label: 'Ticket Statistics',
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043', '#AB47BC'], // Different colors for bars
          data: [
            data.totalTickets,
            data.resolvedTickets,
            data.unresolvedTickets,
            ...Object.values(data.ticketsByPriority)
          ]
        }
      ]
    };

    this.basicOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`
          }
        }
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Categories'
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Number of Tickets'
          },
          beginAtZero: true,
          ticks: {
            callback: (value: number) => (Number.isInteger(value) ? value : ''), // Show only integers
            stepSize: 1 // Ensure step size of 1 for integer values
          }
        }
      }
    };
  }

  private createSentimentChartData(data: AverageFeedbackSentiment): void {
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
