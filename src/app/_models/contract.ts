export interface Contract{
    id: number;
    projectName: string;
    startDate: Date;
    budget: number;
    estimatedFinishDate: Date;
    offersSupport : number;
    beneficiaryCompanyName: string;
    softwareCompanyName: string;
    status: number;
    description: string;
    softwareCompanyPhotoUrl: string;
    beneficiaryCompanyPhotoUrl: string;
}