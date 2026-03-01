export interface Patient {
  id: number;
  name: string;
  email: string;
  image: string;
  sex: string;
  age: number;
  blood: string;
  status: string;
  department: string;
  registeredDate: string;
  appointment: number;
  bedNumber: string;
  vitals: {
    bloodPressure: {
      value: string;
      status: string;
      type: string;
    };
    heartRate: {
      value: string;
      status: string;
      type: string;
    };
    glucose: {
      value: string;
      status: string;
      type: string;
    };
    cholesterol: {
      value: string;
      status: string;
      type: string;
    };
  };
  totalVisits: number;
  history: {
    date: string;
    diagnosis: string;
    severity: string;
    severityType: string;
    visits: number;
    status: string;
    statusType: string;
  }[];
}

export const patients: Patient[] = [
{
    "id": 1,
    "name": "Mrs. Maria Waston",
    "email": "mariawaston2022@gmail.com",
    "image": "/patients/patient1.jpg",
    "sex": "Female",
    "age": 28,
    "blood": "A+",
    "status": "Active",
    "department": "Cardiology",
    "registeredDate": "20 Jan, 2023",
    "appointment": 35,
    "bedNumber": "#0365",
    "vitals": {
      "bloodPressure": {
        "value": "120/89 mm/hg",
        "status": "In the norm",
        "type": "normal"
      },
      "heartRate": {
        "value": "120 BPM",
        "status": "Above the norm",
        "type": "high"
      },
      "glucose": {
        "value": "97 mg/dl",
        "status": "In the norm",
        "type": "normal"
      },
      "cholesterol": {
        "value": "85 mg/dl",
        "status": "In the norm",
        "type": "normal"
      }
    },
    "totalVisits": 35,
    "history": [
      {
        "date": "20 Jan, 2023",
        "diagnosis": "Malaria",
        "severity": "High",
        "severityType": "high",
        "visits": 2,
        "status": "Under Treatment",
        "statusType": "treatment"
      },
      {
        "date": "12 Jan, 2022",
        "diagnosis": "Viral Fever",
        "severity": "Low",
        "severityType": "low",
        "visits": 1,
        "status": "Cured",
        "statusType": "cured"
      }
    ]
  },
  {
    "id": 2,
    "name": "Mr. John Peterson",
    "email": "john.peterson@gmail.com",
    "image": "/patients/patient2.jpg",
    "sex": "Male",
    "age": 45,
    "blood": "B+",
    "status": "Active",
    "department": "Neurology",
    "registeredDate": "15 Feb, 2022",
    "appointment": 22,
    "bedNumber": "#0212",
    "vitals": {
      "bloodPressure": { "value": "140/95 mm/hg", "status": "Above the norm", "type": "high" },
      "heartRate": { "value": "88 BPM", "status": "In the norm", "type": "normal" },
      "glucose": { "value": "110 mg/dl", "status": "Slightly High", "type": "high" },
      "cholesterol": { "value": "190 mg/dl", "status": "High", "type": "high" }
    },
    "totalVisits": 22,
    "history": [
      {
        "date": "10 Dec, 2023",
        "diagnosis": "Migraine",
        "severity": "Medium",
        "severityType": "medium",
        "visits": 4,
        "status": "Under Treatment",
        "statusType": "treatment"
      }
    ]
  },
  {
    "id": 3,
    "name": "Mrs. Sophia Brown",
    "email": "sophia.brown@gmail.com",
    "image": "/patients/patient3.jpg",
    "sex": "Female",
    "age": 34,
    "blood": "O-",
    "status": "Discharged",
    "department": "Orthopedics",
    "registeredDate": "03 Aug, 2021",
    "appointment": 18,
    "bedNumber": "#0411",
    "vitals": {
      "bloodPressure": { "value": "118/76 mm/hg", "status": "In the norm", "type": "normal" },
      "heartRate": { "value": "72 BPM", "status": "In the norm", "type": "normal" },
      "glucose": { "value": "92 mg/dl", "status": "In the norm", "type": "normal" },
      "cholesterol": { "value": "120 mg/dl", "status": "In the norm", "type": "normal" }
    },
    "totalVisits": 18,
    "history": [
      {
        "date": "01 Mar, 2023",
        "diagnosis": "Fracture",
        "severity": "High",
        "severityType": "high",
        "visits": 3,
        "status": "Cured",
        "statusType": "cured"
      }
    ]
  },
  {
    "id": 4,
    "name": "Mr. Daniel Lee",
    "email": "daniel.lee@gmail.com",
    "image": "/patients/patient4.jpg",
    "sex": "Male",
    "age": 52,
    "blood": "AB+",
    "status": "Active",
    "department": "Cardiology",
    "registeredDate": "10 Oct, 2020",
    "appointment": 41,
    "bedNumber": "#0110",
    "vitals": {
      "bloodPressure": { "value": "150/100 mm/hg", "status": "High", "type": "high" },
      "heartRate": { "value": "130 BPM", "status": "Critical", "type": "critical" },
      "glucose": { "value": "140 mg/dl", "status": "High", "type": "high" },
      "cholesterol": { "value": "210 mg/dl", "status": "High", "type": "high" }
    },
    "totalVisits": 41,
    "history": [
      {
        "date": "20 Jul, 2023",
        "diagnosis": "Heart Disease",
        "severity": "High",
        "severityType": "high",
        "visits": 6,
        "status": "Under Treatment",
        "statusType": "treatment"
      }
    ]
  },
  {
    "id": 5,
    "name": "Mrs. Olivia Martinez",
    "email": "olivia.martinez@gmail.com",
    "image": "/patients/patient5.jpg",
    "sex": "Female",
    "age": 30,
    "blood": "A-",
    "status": "Active",
    "department": "Dermatology",
    "registeredDate": "11 Nov, 2023",
    "appointment": 9,
    "bedNumber": "#0309",
    "vitals": {
      "bloodPressure": { "value": "115/75 mm/hg", "status": "In the norm", "type": "normal" },
      "heartRate": { "value": "78 BPM", "status": "In the norm", "type": "normal" },
      "glucose": { "value": "85 mg/dl", "status": "In the norm", "type": "normal" },
      "cholesterol": { "value": "100 mg/dl", "status": "In the norm", "type": "normal" }
    },
    "totalVisits": 9,
    "history": [
      {
        "date": "15 Jan, 2024",
        "diagnosis": "Skin Allergy",
        "severity": "Low",
        "severityType": "low",
        "visits": 1,
        "status": "Cured",
        "statusType": "cured"
      }
    ]
  },
  {
    "id": 6,
    "name": "Mr. Ethan Clark",
    "email": "ethan.clark@gmail.com",
    "image": "/patients/patient6.jpg",
    "sex": "Male",
    "age": 60,
    "blood": "O+",
    "status": "Critical",
    "department": "ICU",
    "registeredDate": "05 May, 2019",
    "appointment": 58,
    "bedNumber": "#ICU12",
    "vitals": {
      "bloodPressure": { "value": "170/110 mm/hg", "status": "Critical", "type": "critical" },
      "heartRate": { "value": "140 BPM", "status": "Critical", "type": "critical" },
      "glucose": { "value": "180 mg/dl", "status": "High", "type": "high" },
      "cholesterol": { "value": "230 mg/dl", "status": "High", "type": "high" }
    },
    "totalVisits": 58,
    "history": [
      {
        "date": "10 Feb, 2024",
        "diagnosis": "Cardiac Arrest",
        "severity": "Critical",
        "severityType": "critical",
        "visits": 8,
        "status": "Under Treatment",
        "statusType": "treatment"
      }
    ]
  }
];