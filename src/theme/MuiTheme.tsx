import { TypographyVariants } from '@AM-i-B-V/ui-kit';
import { blueGrey, cyan, pink } from '@mui/material/colors';
import { inputLabelClasses } from '@mui/material/InputLabel';
import { menuItemClasses } from '@mui/material/MenuItem';
import {
  Components,
  createTheme,
  PaletteOptions,
  Theme,
} from '@mui/material/styles';
import { TypographyOptions } from '@mui/material/styles/createTypography';
import { MdExpandMore } from 'react-icons/md';

import { colors } from '../../tailwind.config';

const typography = {
  allVariants: { textTransform: 'none' },
  fontSize: 14,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  ...TypographyVariants,
} satisfies TypographyOptions;

const components = {
  MuiButtonGroup: {
    styleOverrides: {
      groupedOutlined: {
        ':not(:last-of-type):hover': {
          borderColor: colors.secondary.DEFAULT,
        },
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'filled',
      fullWidth: true,
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      filled: {
        color: colors.secondary.DEFAULT,
        [`&.${inputLabelClasses.error}`]: {
          // set the color of the label when shrinked (usually when the TextField is focused)
          color: colors.secondary.DEFAULT,
        },
        [`&.${inputLabelClasses.shrink}`]: {
          // set the color of the label when shrinked (usually when the TextField is focused)
          color: '#8C9299',
        },
        [`&.${inputLabelClasses.disabled}`]: {
          // set the color of the label when shrinked (usually when the TextField is focused)
          color: colors.secondary.DEFAULT,
        },
      },
    },
  },
  MuiMenu: {
    styleOverrides: {
      root: {
        top: '0.25rem',
      },
      list: {
        padding: '0',
      },
      paper: {
        borderRadius: '0.25rem',
        boxShadow: '0px 2px 12px 0px rgba(0, 0, 0, 0.12)',
        transitionDuration: '0s !important',
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        backgroundColor: '#fff',

        [`&&.${menuItemClasses.selected}`]: {
          backgroundColor: colors.secondary.DEFAULT,
          color: '#fff',
          ':hover': {
            backgroundColor: colors.secondary.DEFAULT,
          },
          ':active': {
            backgroundColor: colors.secondary.DEFAULT,
          },
        },
      },
    },
  },
  MuiSelect: {
    defaultProps: {
      variant: 'filled',
      IconComponent: MdExpandMore,
    },
    styleOverrides: {
      icon: {
        height: '1.5rem',
        width: '1.5rem',
        top: 'calc(50% - 0.75em)',
      },
    },
  },
  MuiFilledInput: {
    defaultProps: {
      disableUnderline: true,
      fullWidth: true,
    },
    styleOverrides: {
      root: {
        backgroundColor: '#fff',
        ':hover': {
          backgroundColor: '#fff',
        },
        border: '1px solid #DEE0E2',
        borderRadius: '0.25rem',
        '&.Mui-error': {
          borderBottom: `3px solid ${colors.primary.DEFAULT}`,
        },
        '&.Mui-focused': {
          backgroundColor: 'white',
        },
        '&.Mui-disabled': {
          backgroundColor: colors.secondary,
          borderColor: colors.secondary,
          color: `${colors.secondary.DEFAULT} !important`,
          WebkitTextFillColor: colors.secondary.DEFAULT,
          '&:hover': {
            backgroundColor: '#0000001f',
          },
        },
      },
      input: {
        '&.Mui-disabled': {
          color: colors.secondary.DEFAULT,
          WebkitTextFillColor: colors.secondary.DEFAULT,
        },
      },
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        marginTop: '0.5rem',
        marginBottom: '0px',
        marginLeft: '0px',
        marginRight: '0px',
        fontSize: '0.75rem',
      },
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
      disableRipple: true,
      focusRipple: false,
    },
    styleOverrides: {
      outlined: {
        backgroundColor: '#fff',
        borderWidth: '2px',
        ':hover': {
          borderWidth: '2px',
        },
        ':disabled': {
          borderWidth: '2px',
        },
      },
      outlinedSecondary: {
        borderColor: colors.secondary.DEFAULT,
        ':hover': {
          color: '#fff',
          borderColor: colors.secondary.DEFAULT,
          backgroundColor: colors.secondary.DEFAULT,
        },
      },
    },
  },
} satisfies Components<Omit<Theme, 'components'>>;

const palette = {
  mode: 'light',
  primary: {
    main: colors.primary.DEFAULT,
  },
  secondary: {
    main: colors.secondary.DEFAULT,
  },
} satisfies PaletteOptions;

export const lightTheme = createTheme({
  typography,
  components,
  palette,
});

export const darkTheme = createTheme({
  typography,
  palette: {
    mode: 'dark',
    primary: {
      main: pink['200'],
    },
    secondary: {
      main: cyan['400'],
    },
    background: {
      default: blueGrey['800'],
      paper: blueGrey['700'],
    },
  },
});
