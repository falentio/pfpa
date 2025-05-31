export type FriendlyErrorOptions = {
	status?: number;
	message: {
		public?: string;
		internal: string;
	};
};

export class FriendlyError extends Error {
	status: number;
	publicMessage: string;
	internalMessage: string;

	constructor(options: FriendlyErrorOptions) {
		super(options.message.internal);
		this.name = "FriendlyError";
		this.status = options.status ?? 500;
		this.publicMessage = options.message.public ?? "Something went wrong";
		this.internalMessage = options.message.internal;
	}
}
