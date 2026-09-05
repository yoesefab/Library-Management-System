import { Avatar as BaseAvatar } from "@base-ui/react/avatar";

export function Avatar({ fallback, imageAlt = "", imageSrc }) {
  return (
    <BaseAvatar.Root aria-hidden="true" className="shadcn-avatar">
      {imageSrc ? (
        <BaseAvatar.Image
          alt={imageAlt}
          className="shadcn-avatar-image"
          src={imageSrc}
        />
      ) : null}
      <BaseAvatar.Fallback className="shadcn-avatar-fallback">
        {fallback}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
