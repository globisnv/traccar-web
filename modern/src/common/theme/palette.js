import {
  amber, grey, green, indigo, red, common,
} from '@mui/material/colors';

const colors = {
  white: common.white,
  background: grey[50],
  primary: indigo[900],
  secondary: green[500],
  positive: green[500],
  medium: amber[700],
  negative: red[500],
  neutral: grey[500],
  custom: '#c5d685',
  custom2: '#6f851c',
  geometry: '#3bb2d0',
};

export default {
  background: {
    default: colors.background,
  },
  primary: {
    main: colors.custom,
    contrastText: colors.white,
  },
  secondary: {
    main: colors.custom2,
    contrastText: colors.white,
  },
  colors,
};
