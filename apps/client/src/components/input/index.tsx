import {
  Form,
  FormField,
  Input,
  Textarea,
  Toggle,
} from '@cloudscape-design/components';
import {
  Controller,
  ControllerProps,
  DefaultValues,
  FieldValues,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import { atom, useAtomValue, useAtom } from 'jotai';
import { useEffectOnce } from 'react-use';

type Control = ControllerProps['control'];
type Rules = ControllerProps['rules'];

type Just<T> = T;
type Nothing = null | undefined;
type Maybe<T> = Just<T> | Nothing;

type Values<N> = DefaultValues<N>;

const formAtom = atom<Maybe<UseFormReturn>>(null);

function useSetForm<N>(defaultValues: Values<N>) {
  const _form = useForm({ defaultValues });
  const [form, setForm] = useAtom(formAtom);

  useEffectOnce(() => {
    setForm(_form);
  });

  return { handleSubmit: form?.handleSubmit };
}

interface ControlledFormProps<N, V extends DefaultValues<N>> {
  errorText: string;
  variant?: 'full-page' | 'embedded';
  actions?: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  defaultValues: V;
  onSubmit: (formData: V) => void;
}

export function ControlledForm<N, V extends DefaultValues<N>>({
  children,
  defaultValues,
  onSubmit,
  ...formProps
}: React.PropsWithChildren<ControlledFormProps<N, V>>) {
  const { handleSubmit } = useSetForm(defaultValues);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (handleSubmit) {
          handleSubmit((formData) => onSubmit(formData as V));
        }
      }}
    >
      <Form {...formProps}>{children}</Form>
    </form>
  );
}

ControlledForm.Input = ControlledInput;
ControlledForm.Textarea = ControlledTextarea;
ControlledForm.Toggle = ControlledToggle;

type FieldConfig =
  | {
      type: 'input';
      value: string;
      onChange: (value: string) => void;
    }
  | {
      type: 'textarea';
      value: string;
      onChange: (value: string) => void;
    }
  | {
      type: 'toggle';
      value: boolean;
      onChange: (value: boolean) => void;
    };

export interface ControlledFieldPropsOld {
  type: FieldConfig['type'];
  name: string;
  rules: Rules;
  autoFocus: boolean;
  description: string;
  errorText: string;
  label: string;
  placeholder: string;
  constraintText: string;
}

interface ControlledFieldProps {
  name: string;
  rules: Rules;
  autoFocus?: boolean;
  constraintText: string;
  description: string;
  label: string;
  placeholder: string;
}

export function ControlledInput(props: ControlledFieldProps) {
  return <ControlledFieldOld type="input" {...props} />;
}

export function ControlledTextarea(props: ControlledFieldProps) {
  return <ControlledFieldOld type="textarea" {...props} />;
}

export function ControlledToggle(props: ControlledFieldProps) {
  return <ControlledFieldOld type="toggle" {...props} />;
}

function useControlledForm() {
  const form = useAtomValue(formAtom);

  return {
    control: form?.control,
    errors: form?.formState.errors,
    handleSubmit: form?.handleSubmit,
  };
}

type ControlledFieldOldProps = ControlledFieldProps & {
  type: FieldConfig['type'];
};
export function ControlledFieldOld({
  type,
  name,
  rules,
  label,
  description,
  placeholder,
  constraintText,
  autoFocus = false,
}: ControlledFieldOldProps) {
  const { control, errors } = useControlledForm();
  const errorText = errors?.[name]?.message?.toString() ?? '';

  return (
    <Controller
      control={control as FieldValues & Control}
      name={name}
      rules={rules}
      render={({ field }) => {
        return (
          <FormField
            label={label}
            description={description}
            errorText={errorText}
            constraintText={constraintText}
          >
            <Field
              autoFocus={autoFocus}
              placeholder={placeholder}
              rules={rules}
              config={{ ...field, type }}
            />
          </FormField>
        );
      }}
    />
  );
}

function Field({
  autoFocus,
  placeholder,
  rules,
  config,
}: {
  placeholder: string;
  autoFocus: boolean;
  rules: Rules;
  config: FieldConfig;
}) {
  return config.type === 'input' ? (
    <Input
      value={config.value}
      placeholder={placeholder}
      autoFocus={autoFocus}
      ariaRequired={rules?.required != null}
      onChange={(event) => config.onChange(event.detail.value)}
    />
  ) : config.type === 'textarea' ? (
    <Textarea
      value={config.value}
      placeholder={placeholder}
      autoFocus={autoFocus}
      ariaRequired={rules?.required != null}
      onChange={(event) => config.onChange(event.detail.value)}
    />
  ) : (
    <Toggle
      checked={config.value}
      onChange={(event) => config.onChange(event.detail.checked)}
    />
  );
}
