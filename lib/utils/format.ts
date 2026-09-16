/** Truncate an Ethereum address: 0x1234...ABCD */
export function truncateAddress(address: string, start = 6, end = 4): string {
  if (!address) return '';
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}

/** Format a Unix timestamp to a human-readable date */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Format file size in human-readable format */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/** Format a hash for display (shortened) */
export function formatHash(hash: string, length = 16): string {
  if (!hash) return '';
  if (hash.length <= length) return hash;
  return `${hash.slice(0, length / 2 + 2)}...${hash.slice(-(length / 2))}`;
}

/** Get explorer URL for a transaction */
export function getExplorerUrl(txHash: string, chainId: number = 84532): string {
  // Base Sepolia
  if (chainId === 84532) {
    return `https://sepolia.basescan.org/tx/${txHash}`;
  }
  // Fallback to Etherscan Sepolia
  return `https://sepolia.etherscan.io/tx/${txHash}`;
}

/** Get explorer URL for an address */
export function getAddressExplorerUrl(address: string, chainId: number = 84532): string {
  if (chainId === 84532) {
    return `https://sepolia.basescan.org/address/${address}`;
  }
  return `https://sepolia.etherscan.io/address/${address}`;
}

/** Accepted file types for document upload */
export const ACCEPTED_FILE_TYPES: Record<string, string[]> = {
  'application/pdf': ['.pdf'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'text/plain': ['.txt', '.md'],
  'text/javascript': ['.js', '.ts', '.jsx', '.tsx'],
  'text/x-python': ['.py'],
  'application/json': ['.json'],
  'text/html': ['.html'],
  'text/css': ['.css'],
};

/** Maximum file size (10 MB) */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Document type options */
export const DOCUMENT_TYPES = [
  'Certificate',
  'CV / Resume',
  'Cover Letter',
  'Design',
  'Portfolio',
  'Source Code',
  'Thesis',
  'Proposal',
  'Report',
  'Contract',
  'Artwork',
  'Other',
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];
