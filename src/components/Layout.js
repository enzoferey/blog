import React from 'react';
import { Link } from 'gatsby';
import Helmet from 'react-helmet';

import sun from '../assets/sun.png';
import moon from '../assets/moon.png';

import { rhythm } from '../utils/typography';

import Toggle from './Toggle';
import Logo from './Logo';

class Layout extends React.Component {
  state = {
    theme: null,
  };
  componentDidMount() {
    this.setState({ theme: window.__theme });
    window.__onThemeChange = () => {
      this.setState({ theme: window.__theme });
    };
  }
  renderHeader() {
    const { location } = this.props;
    const rootPath = `${__PATH_PREFIX__}/`;

    if (location.pathname === rootPath) {
      return (
        <Link
          style={{ boxShadow: 'none', position: 'relative', top: -8 }}
          to={'/'}
        >
          <Logo isFull={true} />
        </Link>
      );
    } else {
      return (
        <Link
          style={{ boxShadow: 'none', position: 'relative', top: -8 }}
          to={'/'}
        >
          <Logo isFull={false} />
        </Link>
      );
    }
  }
  render() {
    const { children } = this.props;

    return (
      <div
        style={{
          color: 'var(--textNormal)',
          background: 'var(--bg)',
          transition: 'color 0.2s ease-out, background 0.2s ease-out',
          minHeight: '100vh',
        }}
      >
        <Helmet
          meta={[
            {
              name: 'theme-color',
              content: this.state.theme === 'light' ? '#ffa8c5' : '#282c35',
            },
          ]}
        />
        <div
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: rhythm(24),
            padding: `2.625rem ${rhythm(3 / 4)}`,
          }}
        >
          <header
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2.625rem',
            }}
          >
            {this.renderHeader()}
            {this.state.theme !== null ? (
              <Toggle
                icons={{
                  checked: (
                    <img
                      alt="Moon icon"
                      src={moon}
                      width="16"
                      height="16"
                      style={{ pointerEvents: 'none' }}
                    />
                  ),
                  unchecked: (
                    <img
                      alt="Sun icon"
                      src={sun}
                      width="16"
                      height="16"
                      style={{ pointerEvents: 'none' }}
                    />
                  ),
                }}
                checked={this.state.theme === 'dark'}
                onChange={e =>
                  window.__setPreferredTheme(
                    e.target.checked ? 'dark' : 'light'
                  )
                }
              />
            ) : (
              <div style={{ height: '24px' }} />
            )}
          </header>
          {children}
        </div>
      </div>
    );
  }
}

export default Layout;
