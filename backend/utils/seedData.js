const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Department = require('../models/Department');
const Incident = require('../models/Incident');

const departments = [
  { name: 'Chemical Processing', description: 'Handles chemical manufacturing and processing operations' },
  { name: 'Electrical Maintenance', description: 'Electrical systems maintenance and repair' },
  { name: 'Quality Control', description: 'Product quality testing and assurance' },
  { name: 'Warehouse & Logistics', description: 'Inventory management and material handling' },
  { name: 'Safety & Compliance', description: 'Safety protocols, training, and regulatory compliance' },
  { name: 'Production Line', description: 'Main production and assembly operations' },
];

const incidents = [
  {
    title: 'Chemical Spill in Reactor Area 3B',
    description: 'Approximately 50 liters of sulfuric acid leaked from a corroded pipeline in the chemical processing unit. The spill was contained within the secondary containment area. No injuries reported.',
    location: 'Reactor Area 3B, Building C',
    incidentDate: new Date('2026-05-15'),
    incidentTime: '14:30',
    category: 'Chemical Leak',
    priority: 'Critical',
    status: 'Under Investigation',
    aiAnalysis: {
      category: 'Chemical Leak',
      severityLevel: 'Critical',
      riskScore: 92,
      rootCauses: ['Corroded pipeline due to age', 'Inadequate inspection schedule', 'Lack of protective coating on pipes'],
      immediateActions: ['Isolate the affected pipeline', 'Deploy spill containment team', 'Notify environmental control'],
      preventiveMeasures: ['Replace all corroded pipelines', 'Increase inspection frequency to monthly', 'Install secondary containment sensors'],
      requiredPPE: ['Chemical resistant suit', 'Acid-resistant gloves', 'Full-face respirator'],
      environmentalImpact: 'Potential soil and groundwater contamination if not contained. Air quality monitoring required.',
      recommendedInvestigation: 'Full root cause analysis including metallurgical testing of failed pipe section. Review maintenance logs for last 2 years.',
      executiveSummary: 'A critical sulfuric acid leak occurred in Reactor Area 3B due to pipeline corrosion. Immediate containment was successful, but this incident highlights systemic inspection gaps that require urgent attention.',
      generatedAt: new Date(),
      isGenerated: true,
    },
    statusHistory: [
      { status: 'Open', changedAt: new Date('2026-05-15T14:35:00'), note: 'Incident reported' },
      { status: 'Under Investigation', changedAt: new Date('2026-05-15T16:00:00'), note: 'Safety team deployed' },
    ],
  },
  {
    title: 'Fire in Electrical Panel Room 2A',
    description: 'A small electrical fire broke out in Panel Room 2A due to a short circuit in the main distribution board. The fire was extinguished by the automatic sprinkler system. No injuries, minor equipment damage.',
    location: 'Panel Room 2A, Building A',
    incidentDate: new Date('2026-05-20'),
    incidentTime: '09:15',
    category: 'Fire Hazard',
    priority: 'High',
    status: 'Resolved',
    aiAnalysis: {
      category: 'Fire Hazard',
      severityLevel: 'High',
      riskScore: 78,
      rootCauses: ['Overloaded electrical circuit', 'Aging electrical panels', 'Inadequate load distribution'],
      immediateActions: ['Isolate power to panel room', 'Deploy fire watch', 'Inspect adjacent panels'],
      preventiveMeasures: ['Redistribute electrical loads', 'Replace aging panels', 'Install thermal imaging sensors'],
      requiredPPE: ['Fire resistant clothing', 'Safety helmet with face shield', 'Insulated gloves'],
      environmentalImpact: 'Smoke impact limited to the panel room. Minor fire suppressant chemical release contained.',
      recommendedInvestigation: 'Review electrical load calculations and panel maintenance records. Conduct thermal scan of all panels.',
      executiveSummary: 'An electrical fire in Panel Room 2A was quickly contained by the sprinkler system. Root cause was an overloaded circuit on an aging panel requiring systematic electrical infrastructure upgrades.',
      generatedAt: new Date(),
      isGenerated: true,
    },
    statusHistory: [
      { status: 'Open', changedAt: new Date('2026-05-20T09:20:00'), note: 'Incident reported' },
      { status: 'Under Investigation', changedAt: new Date('2026-05-20T10:00:00'), note: 'Electrical team investigating' },
      { status: 'Assigned', changedAt: new Date('2026-05-21T08:00:00'), note: 'Assigned to electrical maintenance lead' },
      { status: 'Resolved', changedAt: new Date('2026-05-25T15:30:00'), note: 'Panel repaired and tested' },
    ],
  },
  {
    title: 'Conveyor Belt Jam Leads to Near Miss',
    description: 'A worker narrowly avoided injury when a conveyor belt suddenly jammed and a heavy package fell off the line. The worker was 2 feet away when it happened. No injuries but significant near miss.',
    location: 'Packaging Line 4, Warehouse',
    incidentDate: new Date('2026-06-01'),
    incidentTime: '11:45',
    category: 'Near Miss',
    priority: 'Medium',
    status: 'Assigned',
    aiAnalysis: {
      category: 'Near Miss',
      severityLevel: 'High',
      riskScore: 72,
      rootCauses: ['Misaligned conveyor belt', 'Improper package loading', 'Lack of guardrails'],
      immediateActions: ['Stop the packaging line', 'Inspect entire conveyor system', 'Retrain workers on loading procedures'],
      preventiveMeasures: ['Install emergency stop buttons at regular intervals', 'Add guardrails and safety barriers', 'Implement automated jam detection'],
      requiredPPE: ['Steel-toe boots', 'High visibility vest', 'Safety gloves'],
      environmentalImpact: 'No environmental impact from this incident.',
      recommendedInvestigation: 'Review conveyor maintenance logs and loading procedures. Inspect guardrail installation feasibility.',
      executiveSummary: 'A near miss occurred on Packaging Line 4 when a conveyor jam caused a falling package. Immediate corrective actions include system inspection and worker retraining.',
      generatedAt: new Date(),
      isGenerated: true,
    },
    statusHistory: [
      { status: 'Open', changedAt: new Date('2026-06-01T11:50:00'), note: 'Incident reported' },
      { status: 'Under Investigation', changedAt: new Date('2026-06-01T14:00:00'), note: 'Safety team investigating' },
      { status: 'Assigned', changedAt: new Date('2026-06-02T09:00:00'), note: 'Assigned to warehouse supervisor' },
    ],
  },
  {
    title: 'Gas Detected in Boiler Room',
    description: 'Carbon monoxide detector alarmed in the boiler room during routine operations. Levels were measured at 150 ppm, exceeding safe limits. Area was evacuated and ventilation was increased.',
    location: 'Boiler Room, Building B',
    incidentDate: new Date('2026-06-05'),
    incidentTime: '07:20',
    category: 'Gas Leak',
    priority: 'Critical',
    status: 'Open',
    aiAnalysis: {
      category: 'Gas Leak',
      severityLevel: 'Critical',
      riskScore: 88,
      rootCauses: ['Incomplete combustion in boiler #2', 'Blocked exhaust vent', 'Poor ventilation system maintenance'],
      immediateActions: ['Evacuate boiler room and adjacent areas', 'Shut down boiler #2', 'Increase mechanical ventilation'],
      preventiveMeasures: ['Install redundant CO monitoring', 'Weekly exhaust vent inspections', 'Annual boiler efficiency tuning'],
      requiredPPE: ['Self-contained breathing apparatus', 'CO monitoring badge', 'Safety goggles'],
      environmentalImpact: 'Elevated CO levels contained to boiler room. External venting required. Air quality monitoring initiated.',
      recommendedInvestigation: 'Full boiler combustion analysis. Inspect exhaust system for blockages. Review ventilation system design.',
      executiveSummary: 'Elevated carbon monoxide levels were detected in the boiler room at 150 ppm. The area was evacuated and boiler shut down. This is a critical safety concern requiring immediate engineering controls.',
      generatedAt: new Date(),
      isGenerated: true,
    },
    statusHistory: [
      { status: 'Open', changedAt: new Date('2026-06-05T07:25:00'), note: 'Incident reported' },
    ],
  },
  {
    title: 'PPE Violation in Chemical Storage Area',
    description: 'During a routine inspection, two contract workers were found in the chemical storage area without proper PPE. They were not wearing chemical-resistant gloves or safety goggles as required by protocol.',
    location: 'Chemical Storage Warehouse',
    incidentDate: new Date('2026-06-08'),
    incidentTime: '10:30',
    category: 'PPE Violation',
    priority: 'Medium',
    status: 'Closed',
    aiAnalysis: {
      category: 'PPE Violation',
      severityLevel: 'Medium',
      riskScore: 55,
      rootCauses: ['Inadequate contractor training', 'Lack of supervision', 'Contractor not informed of area hazards'],
      immediateActions: ['Remove workers from area immediately', 'Issue proper PPE', 'Conduct on-the-spot safety briefing'],
      preventiveMeasures: ['Mandatory contractor safety orientation', 'Increase random PPE audits', 'Install PPE dispensing stations at entry points'],
      requiredPPE: ['Chemical splash goggles', 'Nitrile chemical gloves', 'Chemical resistant apron'],
      environmentalImpact: 'No environmental impact. Potential for chemical exposure if incident had not been caught.',
      recommendedInvestigation: 'Review contractor onboarding process. Audit PPE compliance records for all external workers.',
      executiveSummary: 'Contract workers were found without required PPE in a chemical storage area. Immediate corrective action was taken. Systemic issue with contractor safety orientation needs addressing.',
      generatedAt: new Date(),
      isGenerated: true,
    },
    statusHistory: [
      { status: 'Open', changedAt: new Date('2026-06-08T10:35:00'), note: 'Incident reported' },
      { status: 'Closed', changedAt: new Date('2026-06-08T14:00:00'), note: 'Contractor retrained and PPE issued' },
    ],
  },
  {
    title: 'Equipment Failure in Mixing Unit',
    description: 'The primary mixer in Unit 4A malfunctioned during operation, causing abnormal vibrations and loud noises. Operator shut down the equipment immediately. No injuries or product contamination.',
    location: 'Mixing Unit 4A, Production Line',
    incidentDate: new Date('2026-06-10'),
    incidentTime: '15:00',
    category: 'Equipment Failure',
    priority: 'High',
    status: 'Under Investigation',
    aiAnalysis: {
      category: 'Equipment Failure',
      severityLevel: 'Medium',
      riskScore: 65,
      rootCauses: ['Worn bearing in main drive shaft', 'Inadequate lubrication schedule', 'Vibration monitoring system not calibrated'],
      immediateActions: ['Lockout/tagout the mixing unit', 'Inspect drive shaft and bearings', 'Calibrate vibration sensors'],
      preventiveMeasures: ['Implement predictive maintenance program', 'Install real-time vibration monitoring', 'Monthly lubrication audits'],
      requiredPPE: ['Safety glasses', 'Hearing protection', 'Steel-toe boots'],
      environmentalImpact: 'No environmental impact. Equipment failure did not involve hazardous materials.',
      recommendedInvestigation: 'Detailed engineering analysis of failed bearing. Review maintenance records for the past 12 months.',
      executiveSummary: 'The main production mixer in Unit 4A experienced a mechanical failure due to bearing wear. Quick operator action prevented escalation. Predictive maintenance program needs implementation.',
      generatedAt: new Date(),
      isGenerated: true,
    },
    statusHistory: [
      { status: 'Open', changedAt: new Date('2026-06-10T15:05:00'), note: 'Incident reported' },
      { status: 'Under Investigation', changedAt: new Date('2026-06-11T08:00:00'), note: 'Engineering team investigating' },
    ],
  },
  {
    title: 'Oil Spill Near Drainage System',
    description: 'Approximately 20 liters of hydraulic oil leaked from a forklift near the warehouse drainage system. The spill was contained using absorbent booms before reaching the drain. Cleanup completed within 2 hours.',
    location: 'Warehouse Loading Dock',
    incidentDate: new Date('2026-06-12'),
    incidentTime: '13:10',
    category: 'Oil Spill',
    priority: 'High',
    status: 'Resolved',
    aiAnalysis: {
      category: 'Oil Spill',
      severityLevel: 'Medium',
      riskScore: 68,
      rootCauses: ['Damaged hydraulic hose on forklift', 'No regular forklift inspection', 'Absorbent materials not easily accessible'],
      immediateActions: ['Contain spill with absorbent booms', 'Prevent entry to drainage system', 'Clean and dispose contaminated materials'],
      preventiveMeasures: ['Daily forklift pre-use inspections', 'Install spill kits at all loading docks', 'Regular hydraulic system maintenance'],
      requiredPPE: ['Oil-resistant gloves', 'Safety boots', 'Disposable coveralls'],
      environmentalImpact: 'Potential water contamination if oil reached drainage. Successful containment prevented environmental damage.',
      recommendedInvestigation: 'Review forklift maintenance records. Audit spill kit locations and inventory at all loading docks.',
      executiveSummary: 'A hydraulic oil leak from a forklift was quickly contained before reaching the drainage system. Daily vehicle inspections and accessible spill kits are recommended.',
      generatedAt: new Date(),
      isGenerated: true,
    },
    statusHistory: [
      { status: 'Open', changedAt: new Date('2026-06-12T13:15:00'), note: 'Incident reported' },
      { status: 'Resolved', changedAt: new Date('2026-06-12T15:30:00'), note: 'Spill cleaned up, area inspected' },
    ],
  },
  {
    title: 'Unsafe Scaffolding on Exterior Wall',
    description: 'During a routine safety walk, scaffolding erected for exterior painting was found to be unstable with missing guardrails and improper base plates. Work was stopped immediately.',
    location: 'Building A, East Exterior Wall',
    incidentDate: new Date('2026-06-15'),
    incidentTime: '08:45',
    category: 'Unsafe Condition',
    priority: 'High',
    status: 'Closed',
    aiAnalysis: {
      category: 'Unsafe Condition',
      severityLevel: 'High',
      riskScore: 82,
      rootCauses: ['Contractor not following scaffolding standards', 'Inadequate supervision of contractor work', 'No pre-work scaffold inspection'],
      immediateActions: ['Stop all work on scaffolding', 'Cordon off the area', 'Require contractor to re-erect properly'],
      preventiveMeasures: ['Mandatory scaffold inspection before use', 'Contractor safety compliance audits', 'Monthly scaffolding training'],
      requiredPPE: ['Hard hat', 'Safety harness with lanyard', 'Non-slip boots'],
      environmentalImpact: 'No environmental impact.',
      recommendedInvestigation: 'Review contractor safety agreement and compliance history. Audit all contractor scaffolding work.',
      executiveSummary: 'Unsafe scaffolding was identified during a routine walk. Work was halted and contractor directed to re-erect per standards. Stronger contractor oversight is needed.',
      generatedAt: new Date(),
      isGenerated: true,
    },
    statusHistory: [
      { status: 'Open', changedAt: new Date('2026-06-15T08:50:00'), note: 'Incident reported' },
      { status: 'Closed', changedAt: new Date('2026-06-16T16:00:00'), note: 'Scaffolding re-erected and inspected, work resumed' },
    ],
  },
  {
    title: 'Electrical Hazard in Control Room',
    description: 'Exposed wiring was found behind a control panel in the main control room. The panel cover was missing and wires were accessible to operators. Immediate temporary cover was installed.',
    location: 'Main Control Room, Building C',
    incidentDate: new Date('2026-06-18'),
    incidentTime: '16:20',
    category: 'Electrical Hazard',
    priority: 'Critical',
    status: 'Assigned',
    aiAnalysis: {
      category: 'Electrical Hazard',
      severityLevel: 'Critical',
      riskScore: 90,
      rootCauses: ['Missing panel cover after maintenance', 'No post-maintenance inspection checklist', 'Inadequate electrical safety procedures'],
      immediateActions: ['Install temporary cover on panel', 'Isolate power to affected circuits', 'Conduct full electrical audit'],
      preventiveMeasures: ['Post-maintenance inspection sign-off required', 'Lockout/tagout procedure review', 'Monthly electrical panel audits'],
      requiredPPE: ['Electrical safety gloves', 'Arc flash face shield', 'Flame-resistant clothing'],
      environmentalImpact: 'No environmental impact.',
      recommendedInvestigation: 'Review recent maintenance work on the panel. Interview maintenance team about procedures. Audit all panel covers in control room.',
      executiveSummary: 'Exposed live wiring was discovered in the main control room due to a missing panel cover after maintenance. This critical electrical hazard requires immediate procedural improvements.',
      generatedAt: new Date(),
      isGenerated: true,
    },
    statusHistory: [
      { status: 'Open', changedAt: new Date('2026-06-18T16:25:00'), note: 'Incident reported' },
      { status: 'Assigned', changedAt: new Date('2026-06-19T08:00:00'), note: 'Assigned to electrical safety officer' },
    ],
  },
  {
    title: 'Slip and Fall in Canteen Area',
    description: 'An employee slipped on a wet floor near the canteen entrance. The wet floor warning sign was not placed. Employee sustained minor bruising but no medical treatment was required.',
    location: 'Main Canteen, Ground Floor',
    incidentDate: new Date('2026-06-20'),
    incidentTime: '12:40',
    category: 'Unsafe Condition',
    priority: 'Low',
    status: 'Closed',
    aiAnalysis: {
      category: 'Unsafe Condition',
      severityLevel: 'Low',
      riskScore: 30,
      rootCauses: ['Wet floor not marked', 'No procedure for immediate floor drying', 'Insufficient number of warning signs'],
      immediateActions: ['Clean and dry the floor', 'Place wet floor signs', 'Document the incident'],
      preventiveMeasures: ['Place wet floor signs at all entries', 'Assign caretaker for immediate spill response', 'Purchase additional warning signs'],
      requiredPPE: ['Non-slip shoes'],
      environmentalImpact: 'No environmental impact.',
      recommendedInvestigation: 'Review housekeeping procedures and check sign availability in canteen area.',
      executiveSummary: 'A minor slip incident occurred in the canteen due to an unmarked wet floor. No serious injury but improved housekeeping procedures are needed.',
      generatedAt: new Date(),
      isGenerated: true,
    },
    statusHistory: [
      { status: 'Open', changedAt: new Date('2026-06-20T12:45:00'), note: 'Incident reported' },
      { status: 'Closed', changedAt: new Date('2026-06-20T14:00:00'), note: 'Floor cleaned, signs placed, employee advised' },
    ],
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Department.deleteMany({});
    await Incident.deleteMany({});

    const createdDepartments = await Department.insertMany(departments);
    console.log(`${createdDepartments.length} departments created`);

    const deptMap = {};
    createdDepartments.forEach((d) => {
      deptMap[d.name] = d._id;
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('demo1234', salt);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@safeguard.com',
      password: 'demo1234',
      role: 'admin',
      department: deptMap['Safety & Compliance'],
    });

    const managerUser = await User.create({
      name: 'Priya Mehta',
      email: 'manager@safeguard.com',
      password: 'demo1234',
      role: 'manager',
      department: deptMap['Safety & Compliance'],
    });

    const employeeUser = await User.create({
      name: 'Rahul Sharma',
      email: 'employee@safeguard.com',
      password: 'demo1234',
      role: 'employee',
      department: deptMap['Chemical Processing'],
    });

    console.log('Demo users created');

    const incidentUsers = [adminUser._id, employeeUser._id, employeeUser._id, employeeUser._id, adminUser._id, managerUser._id, employeeUser._id, managerUser._id, adminUser._id, employeeUser._id];
    const assignedUsers = [null, adminUser._id, employeeUser._id, null, managerUser._id, null, null, managerUser._id, managerUser._id, null];

    const incidentData = incidents.map((inc, idx) => {
      const deptNames = ['Chemical Processing', 'Electrical Maintenance', 'Warehouse & Logistics', 'Chemical Processing', 'Chemical Processing', 'Production Line', 'Warehouse & Logistics', 'Production Line', 'Electrical Maintenance', 'Quality Control'];
      const statusHistoryWithUser = inc.statusHistory.map((h) => ({
        ...h,
        changedBy: inc.status === 'Closed' || h.status === 'Closed' ? adminUser._id : managerUser._id,
      }));

      return {
        ...inc,
        department: deptMap[deptNames[idx]],
        reporter: incidentUsers[idx],
        assignedTo: assignedUsers[idx] || undefined,
        statusHistory: statusHistoryWithUser,
      };
    });

    const createdIncidents = await Incident.insertMany(incidentData);
    console.log(`${createdIncidents.length} incidents created`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\nDemo Accounts:');
    console.log('  Admin:    admin@safeguard.com / demo1234');
    console.log('  Manager:  manager@safeguard.com / demo1234');
    console.log('  Employee: employee@safeguard.com / demo1234');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
