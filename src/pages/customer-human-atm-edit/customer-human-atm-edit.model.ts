export class CustomerHumanAtmEditModel {
	supplierId: number = 0;
	items = [{ item: "Cash", quantity: "" }];
	description: string;
	estimatedgGoodsPrice: any;
	startTime: any;
	endTime: any;
	orderType: any;
	zipcode: any;
	using_geolocation: boolean = false;
	minStart: any = new Date().toISOString();
	maxStart: any = new Date(new Date(this.minStart).getTime() + (1000 * 60 * 60 * 24 * 365 * 5)).toISOString();
	dropLat: any;
	dropLong: any;
	secretCode: any;
	couponCode: any;
}