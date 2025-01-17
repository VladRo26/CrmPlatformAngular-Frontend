import { Component, inject, Input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { AccountService } from '../../../_services/account.service';
import { TicketService } from '../../../_services/ticket.service';
import { OnInit } from '@angular/core';
import { NgIf } from '@angular/common';

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

  basicData: any; // Chart.js data
  basicOptions: any; // Chart.js options
  loading: boolean = true; // Loading state for the chart data

 
  ngOnInit(): void {
    if (this.username) {
      this.loadPerformanceData();
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
          beginAtZero: true
        }
      }
    };
  }
}
