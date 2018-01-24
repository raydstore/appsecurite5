import { ErrorHandler } from '@angular/core';

export class AppErrorHandler implements ErrorHandler {
    handleError(error) {
        alert('an unexpected error occured');
        console.log(error);
    }
}