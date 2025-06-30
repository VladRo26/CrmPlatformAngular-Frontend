import { AfterViewInit, Component, inject, Input } from '@angular/core';
import { TicketService } from '../../../_services/ticket.service';
import { FeedbackService } from '../../../_services/feedback.service';
import { ChartModule } from 'primeng/chart';
import { OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-performance-page-beneficiary',
  standalone: true,
  imports: [ChartModule,NgIf,CommonModule],
  templateUrl: './performance-page-beneficiary.component.html',
  styleUrl: './performance-page-beneficiary.component.css'
})
export class PerformancePageBeneficiaryComponent implements OnInit, AfterViewInit{
  @Input() username!: string;

  ticketService = inject(TicketService);
  feedbackService = inject(FeedbackService);

  contractChartData: any;
  contractChartOptions: any;
  statusChartData: any;
  statusChartOptions: any;

  loading: boolean = true;

  ngOnInit(): void {
      console.log('Loaded beneficiary usernamexxx:', this.username); // check if it prints!

    if (this.username) {
      this.loadContractChartData();
      this.loadStatusChartData();
    } else {
      console.error('Username is required for PerformancePageBeneficiaryComponent.');
    }
  }

  
  ngAfterViewInit(): void {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize')); // trigger canvas resize
    }, 200); // wait for DOM to fully paint
  }

  

private loadContractChartData(): void {
  this.ticketService.getTicketsGroupedByContract(this.username).subscribe({
    next: (response) => {
      console.log('Contract chart raw data:', response); // ✅ Log this
      this.loading = false;

      if (!response || !Array.isArray(response) || response.length === 0) {
        console.warn('No contract-based ticket data available:', response);
        this.contractChartData = null;
        return;
      }

      this.createContractChartData(response);
    },
    error: (err) => {
      this.loading = false;
      console.error('Error fetching grouped ticket data by contract:', err);
      this.contractChartData = null;
    }
  });
}


 private loadStatusChartData(): void {
  this.ticketService.getTicketsGroupedByUserStatus(this.username).subscribe({
    next: (response) => {
      console.log('Status chart raw data:', response); // ✅ Log this
      this.loading = false;

      if (!response || !Array.isArray(response) || response.length === 0) {
        console.warn('No status-based ticket data available:', response);
        this.statusChartData = null;
        return;
      }

      this.createStatusChartData(response);
    },
    error: (err) => {
      this.loading = false;
      console.error('Error fetching grouped ticket data by status:', err);
      this.statusChartData = null;
    }
  });
}


  private createContractChartData(data: any[]): void {
    const labels = data.map(item => item.projectName);
    const ticketCounts = data.map(item => item.totalTickets);

    this.contractChartData = {
      labels: labels,
      datasets: [{
        label: 'Tickets per Contract',
        data: ticketCounts,
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043']
      }]
    };

    this.contractChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            maxRotation: 0,
            minRotation: 0,
            autoSkip: false,
            font: {
              size: 7
            }
          }
        },
        y: {
          beginAtZero: true
        }
      }
    };
  }

  private createStatusChartData(data: any[]): void {
    const statuses = data.map(item => item.status);
    const ticketCounts = data.map(item => item.totalTickets);

    this.statusChartData = {
      labels: statuses,
      datasets: [{
        label: 'Tickets by Status',
        data: ticketCounts,
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#FF7043']
      }]
    };

    this.statusChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        }
      }
    };
  }
}
