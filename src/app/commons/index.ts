import * as form from './form';

namespace Common {
  const isNullOrEmpty = (value: string) => {
    return !value;
  };
}

export { form, Common };
