import React from 'react'
import { motion, Variants } from 'framer-motion'
import { classNames } from '@Utils/common'
import { Box, Button } from '@material-ui/core'

import styles from './layout.module.scss'
import Typography from '@material-ui/core/Typography'

interface ToggleIcon {
  isToggled: boolean
  onToggleClicked: () => void
}

const spanOne: Variants = {
  open: {
    translateY: -4,
    rotate: 0,
  },
  close: {
    translateY: 0,
    rotate: 225,
  },
}

const spanTwo: Variants = {
  open: {
    translateY: 4,
    rotate: 0,
    width: '23px',
  },
  close: {
    translateY: 0,
    rotate: 135,
    width: '45px',
  },
}

const MenuBarMotion = motion.custom(Box)

export default ({ onToggleClicked, isToggled }: ToggleIcon) => (
  <motion.div
    initial={'close'}
    animate={isToggled ? 'close' : 'open'}
    className={styles.mainMenuTriggerWrapper}
    title={isToggled ? 'close menu' : 'open menu'}
    aria-label={isToggled ? 'close menu' : 'open menu'}
  >
    <Button
      variant={'text'}
      title={isToggled ? 'close menu' : 'open menu'}
      onClick={onToggleClicked}
      className={styles.mainMenuTrigger}
    >
      <MenuBarMotion
        bgcolor={'white'}
        borderColor={'yellow'}
        variants={spanOne}
        className={styles.span}
      />
      <MenuBarMotion
        bgcolor={'white'}
        borderColor={'yellow'}
        variants={spanTwo}
        className={styles.span}
      />
      <Typography className={classNames(styles.span, styles.text)}>
        Menu
      </Typography>
    </Button>
  </motion.div>
)
