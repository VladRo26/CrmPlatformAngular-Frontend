export class TicketContractsParams {
    private readonly maxPageSize = 50;
    public pageNumber: number = 1;
    private _pageSize: number = 10;
    public get pageSize(): number {
      return this._pageSize;
    }
    public set pageSize(value: number) {
      this._pageSize = value > this.maxPageSize ? this.maxPageSize : value;
    }
  
    // These properties match your backend C# model.
    public sortBy?: string;         // e.g., 'assigned', 'priority', 'status'
    public sortDirection: string = 'desc';
    public handlerUsername?: string
  }
  