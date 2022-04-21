import {HttpContextToken} from "@angular/common/http";

export const JWT_REQUIRED: HttpContextToken<boolean> = new HttpContextToken<boolean>(() => true);
