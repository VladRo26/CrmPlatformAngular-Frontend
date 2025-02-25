export class CompanyParams {
    private readonly maxPageSize = 50;
    pageNumber: number = 1;
    private _pageSize: number = 3;
    get pageSize(): number {
      return this._pageSize;
    }
    set pageSize(value: number) {
      this._pageSize = value > this.maxPageSize ? this.maxPageSize : value;
    }
    companyName?: string;
    orderBy?: string;
  }
  