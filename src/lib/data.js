// Dummy data for the Crowdbricks platform
import accraHeightsImage from "@/assets/accra-heights-complex.jpg";
import kumasiPlazaImage from "@/assets/kumasi-commercial-plaza.jpg";
import knustHousingImage from "@/assets/knust-student-housing.jpg";
import temaIndustrialImage from "@/assets/tema-industrial-park.jpg";
import takoradiHarborImage from "@/assets/takoradi-harbor-view.jpg";
import tamaleMallImage from "@/assets/tamale-mall.jpg";
import capeCoastResortImage from "@/assets/cape-coast-resort.jpg";
import eastLegonOfficesImage from "@/assets/east-legon-offices.jpg";
import asokwaResidencesImage from "@/assets/asokwa-residences.jpg";
import axios from "axios";


export const fetchProjects = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/projects");
    return res.data;
  } catch (err) {
    console.error("Failed to load projects:", err);
    return [];
  }
};
export const projects = [
  {
    id: "1",
    title: "Accra Heights Residential Complex",
    description:
      "Modern 120-unit residential complex in East Legon with world-class amenities including swimming pool, gym, and 24/7 security.",
    location: "East Legon, Accra",
    type: "residential",
    targetFunding: 2500000,
    currentFunding: 1875000,
    minimumInvestment: 1000,
    expectedYield: 12.5,
    image: accraHeightsImage,
    developer: {
      name: "GoldKey Properties",
      verified: true,
      rating: 4.8,
      completedProjects: 12,
    },
    fundingStatus: "active",
    timeline: "24 months",
    investors: 156,
    documents: ["valuation-report.pdf", "title-deed.pdf", "construction-permit.pdf"],
    updates: [
      {
        id: "1",
        title: "Foundation Work Completed",
        date: "2024-01-15",
        content:
          "We've successfully completed the foundation work ahead of schedule. Construction is progressing smoothly.",
      },
    ],
  },
  {
    id: "2",
    title: "Kumasi Commercial Plaza",
    description:
      "Premium commercial space in the heart of Kumasi with retail shops, offices, and parking facilities. Strategic location near major business districts.",
    location: "Adum, Kumasi",
    type: "commercial",
    targetFunding: 3200000,
    currentFunding: 3200000,
    minimumInvestment: 2000,
    expectedYield: 15.2,
    image: kumasiPlazaImage,
    developer: {
      name: "Northern Star Developments",
      verified: true,
      rating: 4.9,
      completedProjects: 8,
    },
    fundingStatus: "funded",
    timeline: "18 months",
    investors: 203,
    documents: ["valuation-report.pdf", "title-deed.pdf", "lease-agreements.pdf"],
    updates: [
      {
        id: "1",
        title: "Funding Target Achieved",
        date: "2024-01-20",
        content:
          "We've successfully reached our funding target! Construction begins next month.",
      },
    ],
  },
  {
    id: "3",
    title: "KNUST Student Housing",
    description:
      "Modern student accommodation facility near KNUST campus with 200 furnished rooms, study areas, and recreational facilities.",
    location: "UST, Kumasi",
    type: "student-housing",
    targetFunding: 1800000,
    currentFunding: 720000,
    minimumInvestment: 500,
    expectedYield: 18.7,
    image: knustHousingImage,
    developer: {
      name: "EduLiving Ghana",
      verified: true,
      rating: 4.6,
      completedProjects: 5,
    },
    fundingStatus: "active",
    timeline: "15 months",
    investors: 89,
    documents: ["valuation-report.pdf", "university-agreement.pdf"],
    updates: [
      {
        id: "1",
        title: "Land Acquisition Complete",
        date: "2024-01-10",
        content:
          "Land acquisition and documentation process has been completed successfully.",
      },
    ],
  },
  {
    id: "4",
    title: "Tema Industrial Park",
    description:
      "A large-scale industrial park development in Tema focused on logistics and warehousing solutions for local manufacturers.",
    location: "Tema, Greater Accra",
    type: "industrial",
    targetFunding: 4000000,
    currentFunding: 2600000,
    minimumInvestment: 3000,
    expectedYield: 14.1,
    image: temaIndustrialImage,
    developer: {
      name: "BlueWave Developers",
      verified: true,
      rating: 4.7,
      completedProjects: 6,
    },
    fundingStatus: "active",
    timeline: "30 months",
    investors: 174,
    documents: ["permit.pdf", "environmental-clearance.pdf"],
    updates: [
      {
        id: "1",
        title: "Site Cleared for Development",
        date: "2024-02-05",
        content:
          "Site preparation and soil testing are complete. Construction begins next quarter.",
      },
    ],
  },
  {
    id: "5",
    title: "Takoradi Harbor View Apartments",
    description:
      "Luxury sea-view apartments overlooking the Takoradi harbor with modern amenities and rooftop leisure area.",
    location: "Takoradi, Western Region",
    type: "residential",
    targetFunding: 2700000,
    currentFunding: 1000000,
    minimumInvestment: 1500,
    expectedYield: 13.8,
    image: takoradiHarborImage,
    developer: {
      name: "Coastal Builders Ltd",
      verified: false,
      rating: 4.3,
      completedProjects: 3,
    },
    fundingStatus: "active",
    timeline: "20 months",
    investors: 102,
    documents: ["valuation.pdf", "building-permit.pdf"],
    updates: [
      {
        id: "1",
        title: "Coastal Survey Completed",
        date: "2024-03-02",
        content:
          "Environmental and coastal impact assessments are completed and approved.",
      },
    ],
  },
  {
    id: "6",
    title: "Tamale City Mall",
    description:
      "A new shopping mall project to bring modern retail and entertainment to the Northern Region.",
    location: "Tamale, Northern Region",
    type: "commercial",
    targetFunding: 3500000,
    currentFunding: 900000,
    minimumInvestment: 2000,
    expectedYield: 17.4,
    image: tamaleMallImage,
    developer: {
      name: "Savannah Real Estate Co.",
      verified: true,
      rating: 4.5,
      completedProjects: 4,
    },
    fundingStatus: "active",
    timeline: "28 months",
    investors: 67,
    documents: ["business-plan.pdf", "title-deed.pdf"],
    updates: [
      {
        id: "1",
        title: "Initial Design Approved",
        date: "2024-04-01",
        content:
          "Design phase completed and approved by city planning authorities.",
      },
    ],
  },
  {
    id: "7",
    title: "Cape Coast Beach Resort",
    description:
      "Eco-friendly beach resort with villas, conference center, and beach bar along the scenic Cape Coast shoreline.",
    location: "Cape Coast, Central Region",
    type: "hospitality",
    targetFunding: 2900000,
    currentFunding: 2450000,
    minimumInvestment: 1000,
    expectedYield: 16.2,
    image: capeCoastResortImage,
    developer: {
      name: "PalmTree Resorts",
      verified: true,
      rating: 4.9,
      completedProjects: 9,
    },
    fundingStatus: "funded",
    timeline: "22 months",
    investors: 198,
    documents: ["eco-impact.pdf", "coastal-permit.pdf"],
    updates: [
      {
        id: "1",
        title: "Construction Begins",
        date: "2024-03-28",
        content:
          "Groundbreaking ceremony held with local officials and investors present.",
      },
    ],
  },
  {
    id: "8",
    title: "East Legon Business Suites",
    description:
      "Modern office complex tailored for startups and SMEs with co-working facilities and rooftop conference spaces.",
    location: "East Legon, Accra",
    type: "commercial",
    targetFunding: 3100000,
    currentFunding: 1600000,
    minimumInvestment: 2500,
    expectedYield: 14.9,
    image: eastLegonOfficesImage,
    developer: {
      name: "UrbanSpace Developers",
      verified: true,
      rating: 4.8,
      completedProjects: 7,
    },
    fundingStatus: "active",
    timeline: "26 months",
    investors: 133,
    documents: ["layout-plan.pdf", "title-deed.pdf"],
    updates: [
      {
        id: "1",
        title: "Land Survey Completed",
        date: "2024-03-12",
        content:
          "Initial site mapping and soil analysis complete. Construction scheduled to begin soon.",
      },
    ],
  },
  {
    id: "9",
    title: "Asokwa Garden Residences",
    description:
      "A gated community of 40 semi-detached homes with solar energy integration and landscaped gardens.",
    location: "Asokwa, Kumasi",
    type: "residential",
    targetFunding: 2200000,
    currentFunding: 850000,
    minimumInvestment: 1200,
    expectedYield: 11.8,
    image: asokwaResidencesImage,
    developer: {
      name: "GreenHome Builders",
      verified: false,
      rating: 4.2,
      completedProjects: 2,
    },
    fundingStatus: "active",
    timeline: "24 months",
    investors: 77,
    documents: ["title-deed.pdf", "environmental-assessment.pdf"],
    updates: [
      {
        id: "1",
        title: "Solar Partnership Secured",
        date: "2024-04-15",
        content:
          "Partnership finalized with SunPower Ghana for full solar integration.",
      },
    ],
  },
];

export const platformStats = {
  totalRaised: 12500000,
  totalInvestors: 1750,
  totalProjects: 37,
  averageReturn: 14.9,
};

export const portfolioData = [
  {
    project: "Accra Heights Residential Complex",
    investment: 5000,
    ownership: 0.2,
    dividends: 625,
    status: "active",
  },
  {
    project: "Kumasi Commercial Plaza",
    investment: 10000,
    ownership: 0.31,
    dividends: 1520,
    status: "funded",
  },
  {
    project: "Tema Industrial Park",
    investment: 3000,
    ownership: 0.15,
    dividends: 420,
    status: "active",
  },
  {
    project: "Cape Coast Beach Resort",
    investment: 8000,
    ownership: 0.27,
    dividends: 1300,
    status: "funded",
  },
];

export const transactionData = [
  {
    id: "1",
    type: "investment",
    project: "Accra Heights Residential Complex",
    amount: 5000,
    date: "2024-01-15",
    status: "completed",
  },
  {
    id: "2",
    type: "dividend",
    project: "Tema Industrial Park",
    amount: 420,
    date: "2024-01-10",
    status: "completed",
  },
  {
    id: "3",
    type: "investment",
    project: "Kumasi Commercial Plaza",
    amount: 10000,
    date: "2024-01-05",
    status: "completed",
  },
  {
    id: "4",
    type: "investment",
    project: "Cape Coast Beach Resort",
    amount: 8000,
    date: "2024-03-22",
    status: "completed",
  },
];
