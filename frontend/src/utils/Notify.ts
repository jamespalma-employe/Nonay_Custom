import { Notify } from 'quasar';

export const triggerSuccess = (msg: string) => {
  Notify.create({
    type: 'positive',
    message: msg,
    iconColor: 'white',
    classes: 'font-medium',
  });
};

export const triggerNegative = (msg: string) => {
  Notify.create({
    type: 'negative',
    message: msg,
    classes: 'font-medium',
  });
};

export const triggerWarning = (msg: string) => {
  Notify.create({
    type: 'warning',
    message: msg,
    iconColor: 'white',
    textColor: 'white',
    classes: 'font-medium',
  });
};

export const triggerInfo = (msg: string) => {
  Notify.create({
    type: 'info',
    message: msg,
    color: 'secondary',
    classes: 'font-medium',
  });
};
