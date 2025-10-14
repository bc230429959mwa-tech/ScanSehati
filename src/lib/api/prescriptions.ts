export async function deletePrescription(uuid: string, userId = 'demo-user') {
  const res = await fetch(`/api/prescriptions/${uuid}?userId=${userId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete prescription');
  return res.json();
}