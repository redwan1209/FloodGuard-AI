import { EmergencyContact } from '../types';

export const EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: 'ndrf-hq',
    agency: 'National Disaster Response Force (NDRF HQ)',
    name: 'National 24x7 Control Room',
    state: 'National (All India)',
    phone: '011-24363260',
    altPhone: '+91 97110 77372',
    type: 'NDRF',
    jurisdiction: 'All India Search & Rescue Operations',
    available24x7: true
  },
  {
    id: 'all-india-emergency',
    agency: 'Emergency Response Support System (ERSS)',
    name: 'Pan-India Unified Emergency Helpline',
    state: 'National (All India)',
    phone: '112',
    type: 'Police',
    jurisdiction: 'Police, Fire, Medical, Flood Emergency',
    available24x7: true
  },
  {
    id: 'national-disaster-helpline',
    agency: 'NDMA Disaster Management Services',
    name: 'National Emergency Operations Centre (NEOC)',
    state: 'National (All India)',
    phone: '1070',
    altPhone: '011-26701728',
    type: 'State EOC',
    jurisdiction: 'National Disaster Coordination',
    available24x7: true
  },
  {
    id: 'district-emergency-helpline',
    agency: 'District Disaster Management Authority (DDMA)',
    name: 'District Emergency Operations Centre (DEOC)',
    state: 'District Specific',
    phone: '1077',
    type: 'District Collector',
    jurisdiction: 'District Level Evacuation & Rescue Coordination',
    available24x7: true
  },
  {
    id: 'asdma-assam',
    agency: 'Assam State Disaster Management Authority (ASDMA)',
    name: 'State EOC Control Room Dispur',
    state: 'Assam',
    phone: '1079',
    altPhone: '0361-2237221',
    type: 'State EOC',
    jurisdiction: 'Brahmaputra Basin Flood Operations',
    available24x7: true
  },
  {
    id: 'bsdma-bihar',
    agency: 'Bihar State Disaster Management Authority (BSDMA)',
    name: 'Disaster Emergency Control Room Patna',
    state: 'Bihar',
    phone: '0612-2294204',
    altPhone: '0612-2294205',
    type: 'State EOC',
    jurisdiction: 'Kosi & Ganga Basin Flood Operations',
    available24x7: true
  },
  {
    id: 'ksdma-kerala',
    agency: 'Kerala State Disaster Management Authority (KSDMA)',
    name: 'State Emergency Operations Centre Thiruvananthapuram',
    state: 'Kerala',
    phone: '0471-2364424',
    altPhone: '1070',
    type: 'State EOC',
    jurisdiction: 'Periyar & Dam Discharge Inundation Response',
    available24x7: true
  },
  {
    id: 'mcgm-mumbai',
    agency: 'Municipal Corporation of Greater Mumbai (MCGM)',
    name: 'Disaster Management Cell BMC HQ',
    state: 'Maharashtra',
    phone: '1916',
    altPhone: '022-22694725',
    type: 'District Collector',
    jurisdiction: 'Mithi River Basin & Urban Storm Water Response',
    available24x7: true
  },
  {
    id: 'osdma-odisha',
    agency: 'Odisha State Disaster Management Authority (OSDMA)',
    name: 'State Emergency Operations Centre Bhubaneswar',
    state: 'Odisha',
    phone: '0674-2395398',
    altPhone: '1070',
    type: 'State EOC',
    jurisdiction: 'Mahanadi Delta Flood & Cyclone Defense',
    available24x7: true
  }
];
