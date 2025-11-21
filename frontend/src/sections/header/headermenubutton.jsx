import { motion } from 'motion/react';
import { useContext, useEffect, useState } from 'react';
import { useTheme } from '../../hooks/usetheme';
import { FilterContext, useMenu } from '../../contexts/menucontext';

export default function HeaderMenuButton() {
  const menu = useMenu()
  const [headerButtonStatus, setHeaderButtonStatus] = useState('inactive');
  const { theme } = useTheme();
    const { setFiltersFor } = useContext(FilterContext);

  useEffect(() => {
    updateStatus(menu.status)
  }, [menu.status])

  const updateStatus = (status) => {
    setHeaderButtonStatus(status);
    menu.setStatus(status);
  }

  return (
    <>
      <motion.div
        onHoverStart={() => {
          if (headerButtonStatus === 'clicked') {
            updateStatus('clickedHovered');
            return;
          }
          updateStatus('hovered');
        }}
        onHoverEnd={() => {
          if (
            headerButtonStatus === 'clickedHovered' ||
            headerButtonStatus === 'clicked'
          ) {
            updateStatus('clicked');
            return;
          }
          updateStatus('inactive');
        }}

        onClick={() => {
          if (
            headerButtonStatus === 'clicked' ||
            headerButtonStatus === 'clickedHovered'
          ) {
            setFiltersFor("ماژول")
            updateStatus('hovered');
            return;
          }
          updateStatus('clickedHovered');
        }}
        initial={false}
        animate={headerButtonStatus}
        variants={{
          inactive: {
            border: `2px solid ${
              theme === 'dark' ? 'rgb(90, 90, 90)' : 'rgb(55, 55, 55)'
            }`,
          },
          hovered: {
            boxShadow: '0 0 10px 2px #00cee4',
          },
          clicked: {
            border: 'none',
          },
          clickedHovered: {
            border: 'none',
            boxShadow: '0 0 10px 2px #00cee4',
          },
        }}
        className="w-[40px] h-[40px] my-auto fill-fg cursor-pointer border-2 border-fg rounded-md relative z-7"
      >
        <motion.svg
          initial={false}
          animate={headerButtonStatus}
          variants={{
            inactive: {
              rotate: 0,
            },
            hovered: {
              rotate: '20deg',
            },
            clicked: {
              rotate: '45deg',
            },
            clickedHovered: {
              rotate: '45deg',
            },
          }}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 256 256"
          enableBackground="new 0 0 256 256"
          xmlSpace="preserve"
          className="w-[90%] h-[100%] absolute left-[5%]"
        >
          <g>
            <g>
              <path d="M19.4,136.2h87.8h11.5h18.8h6.9h92.3c5.2,0,9.4-3.7,9.4-8.2c0-4.6-4.2-8.2-9.4-8.2h-92.3h-6.9h-18.8h-11.4H19.4c-5.2,0-9.4,3.7-9.4,8.2C10,132.6,14.2,136.2,19.4,136.2z" />
            </g>
          </g>
        </motion.svg>
        <motion.svg
          className="w-[90%] h-[100%] absolute left-[5%]"
          initial={false}
          animate={headerButtonStatus}
          variants={{
            inactive: {
              rotate: 0,
            },
            hovered: {
              rotate: '-20deg',
            },
            clicked: {
              rotate: '-45deg',
            },
            clickedHovered: {
              rotate: '-45deg',
            },
          }}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 256 256"
          enableBackground="new 0 0 256 256"
          xmlSpace="preserve"
        >
          <g>
            <g>
              <path d="M19.4,136.2h87.8h11.5h18.8h6.9h92.3c5.2,0,9.4-3.7,9.4-8.2c0-4.6-4.2-8.2-9.4-8.2h-92.3h-6.9h-18.8h-11.4H19.4c-5.2,0-9.4,3.7-9.4,8.2C10,132.6,14.2,136.2,19.4,136.2z" />
            </g>
          </g>
        </motion.svg>
      </motion.div>
    </>
  );
}
