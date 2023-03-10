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
  FieldValues,
  useForm,
  UseFormProps,
  UseFormReturn,
} from 'react-hook-form';
import { atom, useAtomValue, useAtom } from 'jotai';
import { useEffectOnce } from 'react-use';

type Control = ControllerProps['control'];
type Rules = ControllerProps['rules'];

const formAtom = atom<UseFormReturn<Values<string>> | null>(null);

type Values<N extends string> = Record<N, FieldConfig['value']>;

function useSetForm<N extends string>(defaultValues: Values<N>) {
  const _form = useForm({ defaultValues } as UseFormProps<Values<N>>);
  const [form, setForm] = useAtom(formAtom);

  useEffectOnce(() => {
    setForm(_form);
  });

  return { handleSubmit: form?.handleSubmit };
}

interface ControlledFormProps<N extends string> {
  errorText?: string;
  variant?: 'full-page' | 'embedded';
  actions?: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode;
  defaultValues: Values<N>;
  onSubmit: (formData: Values<N>) => void;
}

export function ControlledForm<N extends string>({
  children,
  defaultValues,
  onSubmit,
  ...formProps
}: React.PropsWithChildren<ControlledFormProps<N>>) {
  const { handleSubmit } = useSetForm(defaultValues);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (handleSubmit) {
          handleSubmit(onSubmit);
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

interface ControlledFieldProps<N extends string> {
  name: N;
  rules: Rules;
  label: string;
  autoFocus?: boolean;
  constraintText?: string;
  description?: string;
  placeholder?: string;
  onChange?: (value: FieldConfig['value']) => void;
}

export function ControlledInput<N extends string>(
  props: ControlledFieldProps<N>,
) {
  return <ControlledFieldOld type="input" {...props} />;
}

export function ControlledTextarea<N extends string>(
  props: ControlledFieldProps<N>,
) {
  return <ControlledFieldOld type="textarea" {...props} />;
}

export function ControlledToggle<N extends string>(
  props: ControlledFieldProps<N>,
) {
  return <ControlledFieldOld type="toggle" {...props} />;
}

function useControlledForm() {
  const form = useAtomValue(formAtom);

  return {
    control: form?.control,
    errors: form?.formState.errors,
    handleSubmit: form?.handleSubmit,
    watch: form?.watch,
  };
}

export function ControlledFieldOld<N extends string>({
  type,
  name,
  rules,
  label,
  description,
  placeholder,
  constraintText,
  autoFocus = false,
  onChange,
}: ControlledFieldProps<N> & { type: FieldConfig['type'] }) {
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
              config={{
                ...field,
                type,
                onChange: (value: FieldConfig['value']) => {
                  field.onChange(value);

                  if (onChange) {
                    onChange(value);
                  }
                },
              }}
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
  placeholder?: string;
  autoFocus?: boolean;
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
