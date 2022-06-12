import { ManualPromise } from '@zimtsui/manual-promise';


export class PublicManualPromise extends ManualPromise<void> {
	public resolve!: (value: void) => void;
	public reject!: (err: Error) => void;
}
