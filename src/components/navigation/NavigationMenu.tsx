'use client';

import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { motion } from 'framer-motion';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface NavigationMenuItemProps
  extends React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Item> {
  isActive: boolean;
}

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <div className={twMerge('absolute left-20 -z-10 m-0 p-0 top-0 h-full flex')}>
    <NavigationMenuPrimitive.Viewport
      className={twMerge(
        'relative -z-10 overflow-hidden bg-secondary text-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left w-80',
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
));
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={twMerge('fixed left-0 top-0 h-full w-20 z-10', className)}
    {...props}
  >
    <div className='relative flex h-full bg-secondary'>
      {children}
      <NavigationMenuViewport />
    </div>
  </NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={twMerge(
      'group flex flex-1 h-full p-0 m-0 flex-col list-none items-center justify-center',
      className
    )}
    {...props}
  />
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Item>,
  NavigationMenuItemProps
>(({ isActive, className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Item
    ref={ref}
    className={twMerge(
      `w-20 h-20 group flex relative hover:text-white ${
        isActive ? 'text-white' : 'text-secondary-500'
      } transition-colors duration-500 justify-center items-center`,
      className
    )}
    {...props}
  >
    {children}

    {isActive && (
      <motion.div
        layoutId='test'
        className='absolute left-0 top-0 flex h-full w-1 items-center justify-center'
      >
        <div className='h-3/4 w-full bg-primary' />
      </motion.div>
    )}
  </NavigationMenuPrimitive.Item>
));
NavigationMenuItem.displayName = NavigationMenuPrimitive.Item.displayName;

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={twMerge(
      'inline-flex data-[state=open]:text-white text-inherit m-0 p-0 border-none w-full h-full items-center justify-center bg-transparent text-sm font-medium focus:bg-accent focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 ',
      className
    )}
    {...props}
  >
    {children}
  </NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={twMerge('left-0 top-0 z-10 w-full md:absolute ', className)}
    {...props}
  />
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={twMerge(
      'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
      className
    )}
    {...props}
  >
    <div className='bg-border relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm shadow-md' />
  </NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName;

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
