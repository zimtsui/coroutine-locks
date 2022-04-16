import { ManualPromise } from 'manual-promise';


export class PublicManualPromise extends ManualPromise {
	public resolve!: (value: void) => void;
	public reject!: (err: Error) => void;
}
