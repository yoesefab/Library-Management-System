import { Menu } from '@base-ui/react/menu'
import { Bell, CaretDown, GearSix, SignOut } from '@phosphor-icons/react'
import { Avatar } from './Avatar.jsx'

export function ProfileMenu({ onLogout, onNavigate, role }) {
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label='Ouvrir le menu de Nadia El Mansouri'
        className='current-user profile-menu-trigger'
      >
        <Avatar fallback='NE' />
        <span className='current-user-details'>
          <span className='current-user-name'>Nadia El Mansouri</span>
          <span className='current-user-role'>{role}</span>
        </span>
        <CaretDown aria-hidden='true' className='profile-menu-caret' />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          align='end'
          className='profile-menu-positioner'
          sideOffset={8}
        >
          <Menu.Popup className='profile-menu-popup'>
            <div className='profile-menu-header'>
              <Avatar fallback='NE' />
              <span>
                <strong>Nadia El Mansouri</strong>
                <small>{role}</small>
              </span>
            </div>
            <Menu.Separator className='profile-menu-separator' />
            <Menu.Item
              className='profile-menu-item'
              onClick={() => onNavigate('Administration')}
            >
              <GearSix aria-hidden='true' />
              Administration
            </Menu.Item>
            <Menu.Item
              className='profile-menu-item'
              onClick={() => onNavigate('Alertes')}
            >
              <Bell aria-hidden='true' />
              Alertes
              <span className='profile-menu-badge'>3</span>
            </Menu.Item>
            <Menu.Separator className='profile-menu-separator' />
            <Menu.Item
              className='profile-menu-item profile-menu-item--danger'
              onClick={onLogout}
            >
              <SignOut aria-hidden='true' />
              Se déconnecter
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
