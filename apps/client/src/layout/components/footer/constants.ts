import { colorBackgroundControlDefault } from '@cloudscape-design/design-tokens';

export const footerColor : { [key in string]: {color: string} }  = {
    cloudshell:{color:colorBackgroundControlDefault},
    feedback:{color:colorBackgroundControlDefault},
    language:{color:colorBackgroundControlDefault},
    privacy: {color: colorBackgroundControlDefault},
    terms: {color: colorBackgroundControlDefault},
    cookie: {color: colorBackgroundControlDefault}
}

export type Links = 'cloudshell' | 'feedback' |'language' | 'privacy' | 'terms' | 'cookie'

