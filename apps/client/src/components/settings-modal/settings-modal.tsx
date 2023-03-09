import Box from '@cloudscape-design/components/box';
import Button from '@cloudscape-design/components/button';
import FormField from '@cloudscape-design/components/form-field';
import Modal from '@cloudscape-design/components/modal';
import SpaceBetween from '@cloudscape-design/components/space-between';
import Toggle from '@cloudscape-design/components/toggle';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import {
  applyDensity,
  Density,
  applyMode,
  Mode,
} from '@cloudscape-design/global-styles';
import { useLocalStorage, useMedia } from 'react-use';

type Dark = 'dark';
type Light = 'light';
type ColorScheme = Dark | Light;

const COLOR_SCHEME_KEY = 'color-scheme' as const;
const DEFAULT_COLOR_SCHEME: ColorScheme = 'dark';

function isDarkColorScheme(colorScheme: ColorScheme): colorScheme is Dark {
  return colorScheme === 'dark';
}

type Comfortable = 'comfortable';
type Compact = 'compact';
type ContentDensity = Comfortable | Compact;

const CONTENT_DENSITY_KEY = 'content-density' as const;
const DEFAULT_CONTENT_DENSITY: ContentDensity = 'comfortable';

function isComfortableContentDensity(
  density: ContentDensity,
): density is Comfortable {
  return density === 'comfortable';
}

export function useSettings() {
  const [isVisible, setIsVisible] = useState(false);

  const isLightPreffered = useMedia('(prefers-color-scheme: light)');
  const initialColorScheme: ColorScheme = isLightPreffered
    ? 'light'
    : DEFAULT_COLOR_SCHEME;
  const [colorScheme = initialColorScheme, setColorScheme] =
    useLocalStorage<ColorScheme>(COLOR_SCHEME_KEY, initialColorScheme);

  const [contentDensity = DEFAULT_CONTENT_DENSITY, setDensity] =
    useLocalStorage<ContentDensity>(
      CONTENT_DENSITY_KEY,
      DEFAULT_CONTENT_DENSITY,
    );

  useEffect(() => {
    applyMode(isDarkColorScheme(colorScheme) ? Mode.Dark : Mode.Light);
    applyDensity(
      isComfortableContentDensity(contentDensity)
        ? Density.Comfortable
        : Density.Compact,
    );
  }, []);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      prefersDarkColorScheme: colorScheme === 'dark',
      prefersComfortableContentDensity: contentDensity === 'comfortable',
    },
  });

  return {
    SettingsModal: () => (
      <Modal
        visible={isVisible}
        header="Settings"
        onDismiss={() => setIsVisible(false)}
        closeAriaLabel="Close settings"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setIsVisible(false)}>
                Cancel
              </Button>

              <Button
                variant="primary"
                formAction="submit"
                onClick={() => {
                  void handleSubmit((formData) => {
                    setIsVisible(false);

                    setColorScheme(
                      formData.prefersDarkColorScheme ? 'dark' : 'light',
                    );
                    setDensity(
                      formData.prefersComfortableContentDensity
                        ? 'comfortable'
                        : 'compact',
                    );

                    applyMode(
                      formData.prefersDarkColorScheme ? Mode.Dark : Mode.Light,
                    );
                    applyDensity(
                      formData.prefersComfortableContentDensity
                        ? Density.Comfortable
                        : Density.Compact,
                    );
                  })();
                }}
              >
                Confirm
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween size="m">
          <Controller
            name="prefersDarkColorScheme"
            control={control}
            render={({ field }) => (
              <FormField
                label="Select color scheme"
                description="Your color scheme setting will be stored by your browser."
              >
                <Toggle
                  checked={field.value}
                  onChange={(event) => field.onChange(event.detail.checked)}
                >
                  Dark
                </Toggle>
              </FormField>
            )}
          />

          <Controller
            name="prefersComfortableContentDensity"
            control={control}
            render={({ field }) => (
              <FormField
                label="Select content density"
                description="Your content density setting will be stored by your browser."
              >
                <Toggle
                  checked={field.value}
                  onChange={(event) => field.onChange(event.detail.checked)}
                >
                  Comfortable
                </Toggle>
              </FormField>
            )}
          />
        </SpaceBetween>
      </Modal>
    ),
    openSettings: () => setIsVisible(true),
  };
}
