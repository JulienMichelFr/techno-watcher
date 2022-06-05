import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';

import { noop, NoopFn } from '../../utils/noop';

@Component({
  selector: 'techno-watcher-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: TagInputComponent, multi: true },
    { provide: NG_VALIDATORS, useExisting: TagInputComponent, multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagInputComponent implements ControlValueAccessor, Validator {
  public disabled: boolean = false;
  public readonly separatorKeysCodes: readonly [number, number] = [ENTER, COMMA] as const;

  private onChange: (value: string[]) => void = noop;
  private onTouched: NoopFn = noop;

  //#region tags
  public get tags(): string[] {
    return this._tags;
  }
  public set tags(value: string[]) {
    this._tags = value;
    this.onChange(value);
  }
  private _tags: string[] = [];
  //#endregion

  //#region required
  @Input()
  public get required(): boolean {
    return this._required;
  }
  public set required(value: BooleanInput) {
    this._required = coerceBooleanProperty(value);
  }
  public _required: boolean = false;
  //#endregion

  //#region ControlValueAccessor
  public registerOnChange(fn: (value: string[]) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: NoopFn): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public writeValue(tags: string[]): void {
    this._tags = tags;
  }
  //#endregion

  //#region Validator
  public validate(): ValidationErrors | null {
    if (this.required && !this.tags?.length) {
      return { required: true };
    }
    return null;
  }
  //#endregion

  public addTag(event: MatChipInputEvent): void {
    const input: HTMLInputElement | undefined = event.chipInput?.inputElement;
    const value: string = (event.value ?? '').trim();

    // Add our tag
    if (value && !this.tags.includes(value)) {
      this.tags = [...this.tags, value];
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  public removeTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      return;
    }

    this.tags = this.tags.filter((t) => t !== tag);
  }

  public trackByTagFn(index: number): number {
    return index;
  }
}
