import { SignUpForm } from './sign-up.form';
import { FormControl } from '@angular/forms';
import { SignUpDTO } from '@techno-watcher/api-models';

describe('SignUpForm', () => {
  let form: SignUpForm;

  beforeEach(() => {
    form = new SignUpForm();
  });

  it('should build correct form', () => {
    expect(form.username).toBeInstanceOf(FormControl);
    expect(form.email).toBeInstanceOf(FormControl);
    expect(form.password).toBeInstanceOf(FormControl);
    expect(form.confirmPassword).toBeInstanceOf(FormControl);
  });

  describe('fromDTO()', () => {
    let dto: Partial<SignUpDTO>;

    beforeEach(() => {
      dto = {
        username: 'username',
        email: 'email',
        password: 'password',
      };
    });

    it('should set values on form', () => {
      form.fromDTO(dto);
      expect(form.username.value).toBe(dto.username);
      expect(form.email.value).toBe(dto.email);
      expect(form.password.value).toBe(dto.password);
      expect(form.confirmPassword.value).toBe(dto.password);
    });

    it('should set not provided values to null', () => {
      form.fromDTO({ username: dto.username });
      expect(form.username.value).toBe(dto.username);
      expect(form.email.value).toBeNull();
      expect(form.password.value).toBeNull();
      expect(form.confirmPassword.value).toBeNull();
    });

    it('should reset previous values when some values are not provided', () => {
      form.fromDTO(dto);
      form.fromDTO({ username: dto.username, email: dto.email });
      expect(form.username.value).toBe(dto.username);
      expect(form.email.value).toBe(dto.email);
      expect(form.password.value).toBeNull();
      expect(form.confirmPassword.value).toBeNull();
    });

    it('should mark form as pristine', () => {
      form.markAsDirty();
      form.fromDTO(dto);
      expect(form.pristine).toBe(true);
    });

    it('should mark form as untouched', () => {
      form.markAsTouched();
      form.fromDTO(dto);
      expect(form.untouched).toBe(true);
    });
  });

  describe('toDTO()', () => {
    it('should return correct value', () => {
      form.setValue({
        username: 'username',
        email: 'email',
        password: 'password',
        confirmPassword: 'password',
      });
      const result: SignUpDTO = form.toDTO();
      expect(result).toBeInstanceOf(SignUpDTO);
      expect(result).toEqual({
        username: 'username',
        email: 'email',
        password: 'password',
      });
    });
  });

  describe('Error messages', () => {
    describe('usernameErrorMessage()', () => {
      beforeEach(() => {
        form.username.markAsTouched();
      });

      it('should not return error message when field has not been touched', () => {
        form.username.markAsUntouched();
        expect(form.usernameErrorMessage).toBeNull();
      });

      it('should return error message when field is empty', () => {
        expect(form.usernameErrorMessage).toEqual('Username is required');
      });

      it('should return error message when field is too short', () => {
        form.username.setValue('a');
        expect(form.usernameErrorMessage).toEqual('Username must be at least 2 characters long');
      });

      it('should return error message when field is too long', () => {
        form.username.setValue('aaaaaaaaaaaaaaaaaaaaa');
        expect(form.usernameErrorMessage).toEqual('Username must be at most 20 characters long');
      });

      it('should not return error message when field is valid', () => {
        form.username.setValue('username');
        expect(form.usernameErrorMessage).toBeNull();
      });
    });

    describe('emailErrorMessage()', () => {
      beforeEach(() => {
        form.email.markAsTouched();
      });

      it('should not return error message when field has not been touched', () => {
        form.email.markAsUntouched();
        expect(form.emailErrorMessage).toBeNull();
      });

      it('should return error message when field is empty', () => {
        expect(form.emailErrorMessage).toEqual('Email is required');
      });

      it('should return error message when field is invalid', () => {
        form.email.setValue('invalid');
        expect(form.emailErrorMessage).toEqual('Email is invalid');
      });

      it('should not return error message when field is valid', () => {
        form.email.setValue('email@test.com');
        expect(form.emailErrorMessage).toBeNull();
      });
    });

    describe('passwordErrorMessage()', () => {
      beforeEach(() => {
        form.password.markAsTouched();
      });

      it('should not return error message when field has not been touched', () => {
        form.password.markAsUntouched();
        expect(form.passwordErrorMessage).toBeNull();
      });

      it('should return error message when field is empty', () => {
        expect(form.passwordErrorMessage).toEqual('Password is required');
      });

      it('should return error message when field is too short', () => {
        form.password.setValue('a');
        expect(form.passwordErrorMessage).toEqual('Password must be at least 8 characters long');
      });

      it('should return error message when field is too long', () => {
        form.password.setValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
        expect(form.passwordErrorMessage).toEqual('Password must be at most 32 characters long');
      });
    });

    describe('confirmPasswordErrorMessage()', () => {
      beforeEach(() => {
        form.confirmPassword.markAsTouched();
        form.password.setValue('password');
        form.password.markAsTouched();
      });

      it('should not return error message when field has not been touched', () => {
        form.confirmPassword.markAsUntouched();
        expect(form.confirmPasswordErrorMessage).toBeNull();
      });

      it('should return error message when field is empty', () => {
        expect(form.confirmPasswordErrorMessage).toEqual('Confirm password is required');
      });

      it('should return error message when field is not equal to password', () => {
        form.confirmPassword.setValue('password1');
        expect(form.confirmPasswordErrorMessage).toEqual('Passwords should match');
      });

      it('should not return error message when field is equal to password', () => {
        form.confirmPassword.setValue('password');
        expect(form.confirmPasswordErrorMessage).toBeNull();
      });
    });
  });
});
