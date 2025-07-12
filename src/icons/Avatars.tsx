import React from 'react';

type AvatarComponent = React.FC<React.SVGProps<SVGSVGElement>>;

const Avatar1: AvatarComponent = (props) => (
  <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="80" height="80" {...props}>
    <mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
      <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
    </mask>
    <g mask="url(#mask__beam)">
      <rect width="36" height="36" fill="#0c8f8f"></rect>
      <rect x="0" y="0" width="36" height="36" transform="translate(4 4) rotate(268 18 18) scale(1.2)" fill="#ffad08" rx="36"></rect>
      <g transform="translate(2 -5) rotate(8 18 18)">
        <path d="M15 20c2 1 4 1 6 0" stroke="#000000" fill="none" strokeLinecap="round"></path>
        <rect x="11" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect>
        <rect x="23" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect>
      </g>
    </g>
  </svg>
);

const Avatar2: AvatarComponent = (props) => (
  <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="80" height="80" {...props}>
    <mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36">
      <rect width="36" height="36" rx="72" fill="#FFFFFF"></rect>
    </mask>
    <g mask="url(#mask__beam)">
      <rect width="36" height="36" fill="#405059"></rect>
      <rect x="0" y="0" width="36" height="36" transform="translate(6 6) rotate(32 18 18) scale(1.2)" fill="#f0e199" rx="36"></rect>
      <g transform="translate(4.5 -3) rotate(2 18 18)">
        <path d="M13,21 a1,1 0 0,0 10,0" fill="#000000"></path>
        <rect x="12" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect>
        <rect x="22" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect>
      </g>
    </g>
  </svg>
);

const Avatar3: AvatarComponent = (props) => (
    <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="80" height="80" {...props}><mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF"></rect></mask><g mask="url(#mask__beam)"><rect width="36" height="36" fill="#8b5cf6"></rect><rect x="0" y="0" width="36" height="36" transform="translate(-4 6) rotate(248 18 18) scale(1.1)" fill="#fde047" rx="36"></rect><g transform="translate(-4 4) rotate(8 18 18)"><path d="M15 21c2 1 4 1 6 0" stroke="#FFFFFF" fill="none" strokeLinecap="round"></path><rect x="10" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF"></rect><rect x="24" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF"></rect></g></g></svg>
);

const Avatar4: AvatarComponent = (props) => (
    <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="80" height="80" {...props}><mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF"></rect></mask><g mask="url(#mask__beam)"><rect width="36" height="36" fill="#ec4899"></rect><rect x="0" y="0" width="36" height="36" transform="translate(6 0) rotate(268 18 18) scale(1.2)" fill="#4ade80" rx="36"></rect><g transform="translate(6 -5) rotate(8 18 18)"><path d="M13,21 a1,1 0 0,0 10,0" fill="#000000"></path><rect x="13" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect><rect x="21" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect></g></g></svg>
);

const Avatar5: AvatarComponent = (props) => (
    <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="80" height="80" {...props}><mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF"></rect></mask><g mask="url(#mask__beam)"><rect width="36" height="36" fill="#d946ef"></rect><rect x="0" y="0" width="36" height="36" transform="translate(4 4) rotate(228 18 18) scale(1.2)" fill="#a7f3d0" rx="36"></rect><g transform="translate(2 -5) rotate(8 18 18)"><path d="M15 20c2 1 4 1 6 0" stroke="#000000" fill="none" strokeLinecap="round"></path><rect x="11" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect><rect x="23" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect></g></g></svg>
);

const Avatar6: AvatarComponent = (props) => (
    <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="80" height="80" {...props}><mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF"></rect></mask><g mask="url(#mask__beam)"><rect width="36" height="36" fill="#f43f5e"></rect><rect x="0" y="0" width="36" height="36" transform="translate(0 -2) rotate(22 18 18) scale(1)" fill="#ffedd5" rx="36"></rect><g transform="translate(0 0) rotate(2 18 18)"><path d="M15 19c2 1 4 1 6 0" stroke="#000000" fill="none" strokeLinecap="round"></path><rect x="14" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect><rect x="20" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect></g></g></svg>
);

const Avatar7: AvatarComponent = (props) => (
    <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="80" height="80" {...props}><mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF"></rect></mask><g mask="url(#mask__beam)"><rect width="36" height="36" fill="#14b8a6"></rect><rect x="0" y="0" width="36" height="36" transform="translate(6 6) rotate(32 18 18) scale(1.2)" fill="#fecaca" rx="36"></rect><g transform="translate(4.5 -3) rotate(2 18 18)"><path d="M13,21 a1,1 0 0,0 10,0" fill="#000000"></path><rect x="12" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect><rect x="22" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect></g></g></svg>
);

const Avatar8: AvatarComponent = (props) => (
    <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="80" height="80" {...props}><mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF"></rect></mask><g mask="url(#mask__beam)"><rect width="36" height="36" fill="#0ea5e9"></rect><rect x="0" y="0" width="36" height="36" transform="translate(-2 8) rotate(328 18 18) scale(1.2)" fill="#cffafe" rx="36"></rect><g transform="translate(-3.5 -1) rotate(-8 18 18)"><path d="M15 20c2 1 4 1 6 0" stroke="#000000" fill="none" strokeLinecap="round"></path><rect x="11" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect><rect x="23" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect></g></g></svg>
);

const Avatar9: AvatarComponent = (props) => (
    <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="80" height="80" {...props}><mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF"></rect></mask><g mask="url(#mask__beam)"><rect width="36" height="36" fill="#eab308"></rect><rect x="0" y="0" width="36" height="36" transform="translate(0 0) rotate(328 18 18) scale(1.2)" fill="#1e293b" rx="36"></rect><g transform="translate(-1.5 -1.5) rotate(-8 18 18)"><path d="M15,21 a1,1 0 0,0 10,0" fill="#FFFFFF"></path><rect x="12" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF"></rect><rect x="22" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#FFFFFF"></rect></g></g></svg>
);

const Avatar10: AvatarComponent = (props) => (
    <svg viewBox="0 0 36 36" fill="none" role="img" xmlns="http://www.w3.org/2000/svg" width="80" height="80" {...props}><mask id="mask__beam" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" rx="72" fill="#FFFFFF"></rect></mask><g mask="url(#mask__beam)"><rect width="36" height="36" fill="#65a30d"></rect><rect x="0" y="0" width="36" height="36" transform="translate(6 -2) rotate(22 18 18) scale(1)" fill="#dcfce7" rx="36"></rect><g transform="translate(3.5 0) rotate(2 18 18)"><path d="M15 19c2 1 4 1 6 0" stroke="#000000" fill="none" strokeLinecap="round"></path><rect x="14" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect><rect x="20" y="14" width="1.5" height="2" rx="1" stroke="none" fill="#000000"></rect></g></g></svg>
);


export const Avatars: Record<string, AvatarComponent> = {
  'avatar-1': Avatar1,
  'avatar-2': Avatar2,
  'avatar-3': Avatar3,
  'avatar-4': Avatar4,
  'avatar-5': Avatar5,
  'avatar-6': Avatar6,
  'avatar-7': Avatar7,
  'avatar-8': Avatar8,
  'avatar-9': Avatar9,
  'avatar-10': Avatar10,
};

export const avatarIds = Object.keys(Avatars);
