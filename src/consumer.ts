export interface Consumer {
	resolve: (resource: void) => void;
	reject: (err: Error) => void;
}
