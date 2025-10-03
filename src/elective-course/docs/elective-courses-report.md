# Elective Courses Report API

**Endpoint:**  
`GET /elective-courses/report`

**Description:**  
Provides analytics for elective courses and enrollments.

**Response:**
```json
{
  "totalCourses": 15,
  "totalEnrollments": 250,
  "enrollmentsPerCourse": [
    { "courseId": 1, "courseName": "AI Fundamentals", "enrollments": 40 },
    { "courseId": 2, "courseName": "Blockchain 101", "enrollments": 60 }
  ],
  "mostPopular": { "courseId": 2, "courseName": "Blockchain 101", "enrollments": 60 },
  "leastPopular": { "courseId": 5, "courseName": "History of Art", "enrollments": 3 },
  "activeCourses": 10,
  "inactiveCourses": 5
}
