import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../../common/config/database/prisma';
import generateToken from '../../common/utils/generateToken';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
    console.log('✅ Users fetched successfully');
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ error: 'There was an error fetching users' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }
    });

    if (!user) {
      res.status(200).json({ user: null, error: 'User not found' });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
    console.log(`✅ User with id ${id} fetched successfully`);
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ error: 'Error fetching user' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { email, username, password, age, interests, skills } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, username, password: hashedPassword, age, interests, skills },
    });

    const token = generateToken(newUser);
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    if (!user.password) {
      res.status(400).json({ error: 'This account uses social login. Please log in with Google or Apple.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid email or password' });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = generateToken(user);
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('❌ Login failed:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { email, username, password, age, interests, skills } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) {
      res.status(200).json({ user: null, error: 'User not found' });
      return;
    }

    const updatedData: any = {};
    if (email) updatedData.email = email;
    if (username) updatedData.username = username;
    if (password) updatedData.password = await bcrypt.hash(password, 10);
    if (age !== undefined) updatedData.age = age;
    if (interests !== undefined) updatedData.interests = interests;
    if (skills !== undefined) updatedData.skills = skills;

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updatedData,
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!user) {
      res.status(200).json({ user: null, error: 'User not found' });
      return;
    }

    await prisma.user.delete({ where: { id: Number(id) } });
    res.json({ message: 'User deleted successfully' });
    console.log(`✅ User with id ${id} deleted successfully`);
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};

export const googleLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, username, googleId, profilePicture } = req.body;

  try {
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      // If user exists, update their googleId if it's not set
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { email },
          data: { googleId, profilePicture: user.profilePicture || profilePicture },
        });
      }
    } else {
      // Create new user if they don't exist
      user = await prisma.user.create({
        data: {
          email,
          username: username || email.split('@')[0],
          googleId,
          profilePicture,
          // Since it's social login, password is null
        },
      });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
    console.log(`✅ User ${email} logged in via Google`);
  } catch (error) {
    console.error('❌ Google Login failed:', error);
    res.status(500).json({ error: 'Google Login failed' });
  }
};

export const appleLogin = async (req: Request, res: Response): Promise<void> => {
  const { email, username, appleId } = req.body;

  try {
    let user = await prisma.user.findUnique({ where: { email } });

    if (user) {
      if (!user.appleId) {
        user = await prisma.user.update({
          where: { email },
          data: { appleId },
        });
      }
    } else {
      user = await prisma.user.create({
        data: {
          email,
          username: username || email.split('@')[0],
          appleId,
        },
      });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
    console.log(`✅ User ${email} logged in via Apple`);
  } catch (error) {
    console.error('❌ Apple Login failed:', error);
    res.status(500).json({ error: 'Apple Login failed' });
  }
};
