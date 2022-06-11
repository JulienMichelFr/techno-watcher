import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';

import { noop, NoopFn } from '../../utils/noop';
import { MarkdownRendererComponentModule } from '../markdown-renderer/markdown-renderer.component';

@Component({
  selector: 'techno-watcher-markdown-input',
  templateUrl: './markdown-input.component.html',
  styleUrls: ['./markdown-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: MarkdownInputComponent, multi: true },
    { provide: NG_VALIDATORS, useExisting: MarkdownInputComponent, multi: true },
  ],
})
export class MarkdownInputComponent implements ControlValueAccessor, Validator {
  public disabled: boolean = false;

  private onChange: (value: string) => void = noop;
  private onTouched: NoopFn = noop;

  @Input() public placeholder: string = '';

  //#region content
  public get content(): string {
    return this._content;
  }

  public set content(value: string) {
    this._content = value;
    this.onChange(value);
  }

  private _content: string = '';
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
  public registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: NoopFn): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public writeValue(content: string): void {
    this._content = content;
  }

  //#endregion

  //#region Validator
  public validate(): ValidationErrors | null {
    if (this.required && !this.content?.length) {
      return { required: true };
    }
    return null;
  }

  //#endregion
}

//#region Module
@NgModule({
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule, MarkdownRendererComponentModule, MatTabsModule],
  declarations: [MarkdownInputComponent],
  exports: [MarkdownInputComponent],
})
export class MarkdownInputComponentModule {}

//#endregion
