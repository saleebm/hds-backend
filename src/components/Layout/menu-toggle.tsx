import React from 'react'
import { motion, Variants } from 'framer-motion'
import classNames from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

import styles from './layout.module.scss'

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
  initial: {
    translateY: -300,
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
  initial: {
    translateY: -300,
  },
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.text.primary,
  },
  button: {
    width: '90px',
    height: '70px',
  },
}))

export const MenuToggle = ({ onToggleClicked, isToggled }: ToggleIcon) => {
  const classes = useStyles()
  return (
    <motion.div
      initial={'close'}
      animate={isToggled ? 'close' : 'open'}
      className={styles.mainMenuTriggerWrapper}
      title={isToggled ? 'close menu' : 'open menu'}
      aria-label={isToggled ? 'close menu' : 'open menu'}
    >
      <Button
        aria-label={'menu button'}
        variant={'text'}
        title={isToggled ? 'close menu' : 'open menu'}
        onClick={onToggleClicked}
        className={classNames(classes.button, styles.mainMenuTrigger)}
      >
        <motion.span
          variants={spanOne}
          className={classNames(styles.span, classes.root)}
          initial={'initial'}
        />
        <motion.span
          variants={spanTwo}
          initial={'initial'}
          className={classNames(styles.span, classes.root)}
        />
      </Button>
    </motion.div>
  )
}
