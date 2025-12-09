import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false
}

export const theme = extendTheme({
  config,

  colors: {
    ink: {
      50: '#E5E7EC',
      100: '#C4C9D5',
      200: '#A0A8BC',
      300: '#7B869F',
      400: '#58627F',
      500: '#32394A',
      600: '#232A3A',
      700: '#141924',
      800: '#0B0F18',
      900: '#05060B'
    },
    paper: {
      default: '#F5F5F5'
    },
    sunlight: {
      50: '#FDFFE5',
      100: '#FAFFB6',
      200: '#F6FF73',
      300: '#F2FF3A',
      400: '#E5F20F',
      500: '#C7D600',
      600: '#9FAA00',
      700: '#6F7800',
      800: '#464C00',
      900: '#232600'
    },
    sunset: {
      50: '#FFF4E5',
      100: '#FFE4BD',
      200: '#FFD28F',
      300: '#FFBA55',
      400: '#FFA12C',
      500: '#FF8A1E',
      600: '#F56A1A',
      700: '#D34717',
      800: '#8F2A15',
      900: '#3E130C'
    }
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 0,
        fontFamily: 'heading',
        fontSize: 'xs',
        fontWeight: 500,
        letterSpacing: '0.03em',
        lineHeight: 1.2,
        textTransform: 'uppercase'
      },
      defaultProps: {
        variant: 'solid'
      },
      variants: {
        ghost: {
          _active: {
            bg: 'whiteAlpha.200'
          },
          _hover: {
            bg: 'whiteAlpha.100'
          },
          bg: 'transparent',
          color: 'pc.primary'
        },
        outline: {
          _active: {
            bg: 'whiteAlpha.200'
          },
          _hover: {
            bg: 'whiteAlpha.100'
          },
          bg: 'transparent',
          borderColor: 'pc.primary',
          borderWidth: '1px',
          color: 'pc.primary'
        },
        solid: {
          _active: {
            bg: 'pc.primaryActive'
          },
          _hover: {
            bg: 'pc.primaryHover'
          },
          bg: 'pc.primary',
          color: 'blackAlpha.800'
        }
      }
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'pc.surface',
          borderColor: 'pc.border',
          borderRadius: 0,
          borderWidth: '1px',
          px: 6,
          py: 5
        }
      }
    },
    Heading: {
      defaultProps: {
        variant: 'manifesto'
      },
      sizes: {
        lg: {
          fontSize: ['xl', '2xl', '3xl']
        },
        md: {
          fontSize: ['lg', 'xl', '2xl']
        },
        sm: {
          fontSize: ['md', 'ld', 'xl']
        },
        xl: {
          fontSize: ['2xl', '3xl', '4xl']
        },
        xs: {
          fontSize: ['sm', 'md', 'lg']
        }
      },
      variants: {
        manifesto: {
          color: 'pc.text',
          fontFamily: 'heading',
          fontWeight: 'normal',
          letterSpacing: '0.02em',
          textTransform: 'uppercase'
        },
        thin: {
          color: 'pc.text',
          fontFamily: 'heading',
          fontWeight: 100,
          letterSpacing: '0.02em',
          lineHeight: 1.2
        }
      }
    },
    Tag: {
      baseStyle: {
        container: {
          bg: 'whiteAlpha.200',
          borderRadius: 0,
          color: 'ink.100',
          fontFamily: 'heading',
          fontSize: '0.7rem',
          fontWeight: 100,
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }
      }
    },
    Text: {
      baseStyle: {
        color: 'pc.textMuted'
      }
    }
  },
  fonts: {
    body: `'Inter', system-ui, sans-serif`,
    heading: `'Anton', system-ui, sans-serif`,
    mono: `'Mono', ui-monospace, monospace`
  },
  semanticTokens: {
    colors: {
      'pc.bg': 'ink.800',
      'pc.bgAlt': 'ink.900',
      'pc.border': 'ink.500',
      'pc.primary': 'sunlight.400',
      'pc.primaryActive': 'sunlight.200',
      'pc.primaryHover': 'sunlight.300',
      'pc.secondary': 'sunset.400',
      'pc.secondaryActive': 'sunset.200',
      'pc.secondaryHover': 'sunset.300',
      'pc.surface': 'ink.700',
      'pc.surfaceInverted': 'paper.default',
      'pc.text': 'whiteAlpha.900',
      'pc.textMuted': 'whiteAlpha.700',
      'pc.textOnLight': 'ink.900'
    }
  },
  styles: {
    global: {
      '*::selection': {
        bg: 'pc.primary',
        color: 'pc.bgAlt'
      },
      body: {
        margin: '0 auto',
        maxWidth: '1200px',
        padding: '3rem 1.5rem 4rem'
      },
      'html, body': {
        bg: 'pc.bg',
        color: 'pc.text',
        fontSize: '1rem',
        lineHeight: 1.6
      }
    }
  }
})
