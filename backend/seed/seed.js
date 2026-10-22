import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";
import { generateQRCode } from "../utils/generateQRCode.js";
import { defaultCategories, eventSeeds, demoUserSeeds, bookingSeeds, daysFromNow } from "./eventData.js";

const seedAdmin = async () => {
  const adminEmail = "admin@eventhub.com";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: "Super Admin",
      email: adminEmail,
      password: "Admin@12345",
      role: "admin",
      isEmailVerified: true,
    });
    console.log("Admin user created: admin@eventhub.com / Admin@12345");
  } else {
    console.log("Admin user already exists, skipping.");
  }
  return admin;
};

const seedCategories = async () => {
  const categoryMap = {};
  for (const cat of defaultCategories) {
    let category = await Category.findOne({ name: cat.name });
    if (!category) {
      category = await Category.create(cat);
      console.log(`Category created: ${cat.name}`);
    }
    categoryMap[cat.name] = category._id;
  }
  return categoryMap;
};

const seedEvents = async (adminId, categoryMap) => {
  const existingCount = await Event.countDocuments();
  if (existingCount > 0) {
    console.log(`Skipping event seed: ${existingCount} event(s) already exist.`);
    return;
  }

  for (const seed of eventSeeds) {
    const categoryId = categoryMap[seed.categoryName];
    if (!categoryId) {
      console.log(`Skipping "${seed.title}": category "${seed.categoryName}" not found.`);
      continue;
    }

    await Event.create({
      title: seed.title,
      description: seed.description,
      shortDescription: seed.shortDescription,
      category: categoryId,
      venue: seed.venue,
      city: seed.city,
      address: seed.address,
      date: daysFromNow(seed.daysOut),
      time: seed.time,
      organizer: {
        name: seed.organizerName,
        email: seed.organizerEmail,
        phone: seed.organizerPhone,
      },
      seats: seed.seats,
      bookedSeats: seed.bookedSeats,
      price: seed.price,
      status: seed.status || "published",
      isFeatured: !!seed.isFeatured,
      images: [
        { url: `https://picsum.photos/seed/${seed.imageSlug}-1/900/600`, publicId: `seed/${seed.imageSlug}-1` },
        { url: `https://picsum.photos/seed/${seed.imageSlug}-2/900/600`, publicId: `seed/${seed.imageSlug}-2` },
      ],
      createdBy: adminId,
    });
    console.log(`Event created: ${seed.title} (${seed.city})`);
  }
};

const seedDemoUsers = async () => {
  const usersByEmail = {};
  for (const seed of demoUserSeeds) {
    let user = await User.findOne({ email: seed.email });
    if (!user) {
      user = await User.create({
        name: seed.name,
        email: seed.email,
        password: "Demo@1234",
        phone: seed.phone,
        role: "user",
        isEmailVerified: true,
      });
      console.log(`Demo user created: ${seed.email} / Demo@1234`);
    } else {
      console.log(`Demo user already exists: ${seed.email}, skipping.`);
    }
    usersByEmail[seed.email] = user;
  }
  return usersByEmail;
};

const seedDemoBookings = async (usersByEmail, events) => {
  const eventsByTitle = {};
  events.forEach((e) => { eventsByTitle[e.title] = e; });

  for (const seed of bookingSeeds) {
    const user = usersByEmail[seed.email];
    const event = eventsByTitle[seed.eventTitle];
    if (!user || !event) {
      console.log(`Skipping booking for ${seed.email} -> "${seed.eventTitle}": missing user or event.`);
      continue;
    }

    const alreadyExists = await Booking.findOne({ userId: user._id, eventId: event._id });
    if (alreadyExists) continue;

    const booking = await Booking.create({
      userId: user._id,
      eventId: event._id,
      ticketCount: seed.ticketCount,
      totalAmount: event.price * seed.ticketCount,
      attendeeName: user.name,
      attendeeEmail: user.email,
      attendeePhone: user.phone,
      bookingStatus: seed.bookingStatus,
      paymentStatus: seed.paymentStatus,
    });

    booking.qrCode = await generateQRCode({
      ticketId: booking.ticketId,
      eventId: event._id.toString(),
      eventTitle: event.title,
      userId: user._id.toString(),
      ticketCount: seed.ticketCount,
    });
    await booking.save();
    console.log(`Booking created: ${user.name} -> ${event.title} (${seed.bookingStatus})`);
  }
};

const run = async () => {
  await connectDB();

  const admin = await seedAdmin();
  const categoryMap = await seedCategories();
  await seedEvents(admin._id, categoryMap);

  const events = await Event.find();
  const usersByEmail = await seedDemoUsers();
  await seedDemoBookings(usersByEmail, events);

  console.log("Seeding complete.");
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
