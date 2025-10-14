import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Patient from '@/models/Patient';
import User from '@/models/User';

// GET /api/patient/[id]
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();
  const { id } = await context.params;
  const decodedId = decodeURIComponent(id);

  let patient = null;
  let user = await User.findOne({ email: decodedId });

  if (user) {
    patient = await Patient.findOne({ userId: user._id });
  }

  if (!patient) {
    patient = await Patient.findOne({ userId: decodedId });
    if (!user && patient) {
      user = await User.findById(patient.userId);
    }
  }

  if (!patient && user) {
    patient = new Patient({
      userId: user._id,
      name: user.fullName || '',
      username: user.username,
      medications: [],
    });
    await patient.save();
  }

  if (!patient) {
    return new Response(JSON.stringify({ patient: null }), { status: 404 });
  }

  return new Response(
    JSON.stringify({
      patient: {
        ...patient.toObject(),
        username: user?.username || patient.username || '',
        fullName: user?.fullName || patient.name || '',
      },
    }),
    { status: 200 }
  );
}

// POST /api/patient/[id]
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectToDatabase();
  const { id } = await context.params;
  const decodedId = decodeURIComponent(id);

  const body = await req.json();

  let user = await User.findOne({ email: decodedId });
  let patient = null;

  if (user) {
    patient = await Patient.findOne({ userId: user._id });
  }

  if (!patient) {
    return new Response(JSON.stringify({ error: 'Patient not found' }), { status: 404 });
  }

  // ✅ Update medications
  if (body.medications) {
    patient.medications = body.medications;
    await patient.save();
  }

  return new Response(
    JSON.stringify({
      patient: {
        ...patient.toObject(),
        username: user?.username || patient.username || '',
        fullName: user?.fullName || patient.name || '',
      },
    }),
    { status: 200 }
  );
}
