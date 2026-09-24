import { Hostel } from '../models/index.js';
import { HttpError } from '../middleware/http.js';
export async function ownedHostel(id, user) {
  const hostel = await Hostel.findOne({ _id: id, deletedAt: null });
  if (!hostel) throw new HttpError(404, 'Hostel not found');
  if (String(hostel.owner) !== user.id) throw new HttpError(403, 'You do not own this hostel');
  return hostel;
}
export function requireEditable(hostel) {
  if (hostel.status === 'SUSPENDED') throw new HttpError(409, 'A suspended listing must be restored by an administrator');
}
export function resetReview(hostel) {
  hostel.status = 'DRAFT';
  hostel.moderationReason = undefined;
  hostel.moderatedBy = undefined;
  hostel.moderatedAt = undefined;
}
