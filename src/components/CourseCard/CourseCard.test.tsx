import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CourseCard from './CourseCard';
import type { Course } from '../../types/course.types';

const mockCourse: Course = {
  _id: '1',
  nameRU: 'Йога',
  nameEN: 'Yoga',
  description: 'Описание',
  directions: [],
  fitting: [],
  difficulty: 'начальный',
  durationInDays: 20,
  dailyDurationInMinutes: { from: 20, to: 40 },
  workouts: [],
  order: 1,
};

describe('CourseCard', () => {
  it('отображает название курса', () => {
    render(
      <BrowserRouter>
        <CourseCard course={mockCourse} isAuthenticated={false} />
      </BrowserRouter>
    );
    expect(screen.getByText('Йога')).toBeInTheDocument();
  });
});