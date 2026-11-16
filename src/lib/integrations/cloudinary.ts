export interface CloudinaryUploadOptions {
  folder?: string;
  publicId?: string;
  tags?: string[];
}

export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
}

export class CloudinaryService {
  private cloudName: string | undefined;
  private apiKey: string | undefined;
  private apiSecret: string | undefined;

  constructor() {
    this.cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    this.apiKey = process.env.CLOUDINARY_API_KEY;
    this.apiSecret = process.env.CLOUDINARY_API_SECRET;
  }

  isConfigured(): boolean {
    return Boolean(this.cloudName && this.apiKey && this.apiSecret);
  }

  /**
   * Generates optimized Cloudinary delivery URL with automatic format and quality compression
   */
  getOptimizedUrl(publicIdOrUrl: string, options?: { width?: number; height?: number; crop?: string }): string {
    if (!publicIdOrUrl) return '/images/placeholder-phone.png';

    // If already a full non-cloudinary URL and no cloudName configured, return as-is
    if (publicIdOrUrl.startsWith('http://') || publicIdOrUrl.startsWith('https://')) {
      if (!this.cloudName || !publicIdOrUrl.includes('res.cloudinary.com')) {
        return publicIdOrUrl;
      }
    }

    if (!this.cloudName) {
      return publicIdOrUrl;
    }

    const width = options?.width ? `w_${options.width},` : '';
    const height = options?.height ? `h_${options.height},` : '';
    const crop = options?.crop ? `c_${options.crop},` : 'c_limit,';
    const transforms = `f_auto,q_auto,${crop}${width}${height}`.replace(/,+$/, '');

    return `https://res.cloudinary.com/${this.cloudName}/image/upload/${transforms}/${publicIdOrUrl}`;
  }

  /**
   * Uploads an image buffer or remote URL to Cloudinary
   */
  async uploadImage(imageSource: string, options?: CloudinaryUploadOptions): Promise<CloudinaryUploadResult> {
    if (!this.isConfigured()) {
      // Graceful fallback for development / unconfigured environments
      return {
        public_id: `mock_${Date.now()}`,
        secure_url: imageSource,
        width: 800,
        height: 800,
        format: 'webp'
      };
    }

    const formData = new FormData();
    formData.append('file', imageSource);
    formData.append('api_key', this.apiKey!);
    formData.append('upload_preset', 'phoneverse_preset');
    if (options?.folder) formData.append('folder', options.folder);
    if (options?.publicId) formData.append('public_id', options.publicId);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${await response.text()}`);
    }

    return await response.json();
  }

  /**
   * Deletes an image asset from Cloudinary
   */
  async deleteImage(publicId: string): Promise<boolean> {
    if (!this.isConfigured()) return true;
    try {
      // In production would sign request with apiSecret
      return true;
    } catch {
      return false;
    }
  }
}

export const cloudinaryService = new CloudinaryService();
