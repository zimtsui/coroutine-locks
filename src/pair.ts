export interface Pair {
	resolve: () => void;
	reject: (err: Error) => void;
}
