
export interface Driver {
  last_name: string
  first_name: string;
  suffix: string;
  car_number: string;
  hometown: string;
}


export default function parseDriverData(fileContent: string): Driver[] {
  const lines = fileContent.split('\n');
  const drivers: Driver[] = [];
  
  for (const line of lines) {
    // Skip empty lines and comment lines
    if (!line.trim() || line.startsWith('//')) continue;
    
    const match = line.match(/^\d+\s+(\d+\w*)\s+([^,]+),\s+([^,]+)/);
    if (!match) continue;
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, carNumber, name, hometown] = match;
    const nameParts = name.trim().split(' ');
    const firstName = nameParts.shift() || '';
    const lastName = nameParts.join(' ');
    
    drivers.push({
      last_name: lastName,
      first_name: firstName,
      suffix: '',
      car_number: carNumber,
      hometown: hometown.trim()
    });
  }
  
  return drivers;
}