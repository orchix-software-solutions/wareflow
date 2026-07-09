export interface BrandingAsset {
  url: string;
  updatedAt: string;
}

export interface Branding {
  logoLight: BrandingAsset | null;
  logoDark: BrandingAsset | null;
  favicon: BrandingAsset | null;
}

export interface UpdateBrandingPayload {
  logoLight?: File;
  logoDark?: File;
  favicon?: File;
}
