from typing import List, TypedDict
import re



filepath = '/home/jake/repos/hardcharger-app/src/data/drivers_2025.txt'


class Driver(TypedDict):
  last_name: str
  first_name: str
  suffix: str
  car_number: str
  hometown: str

example_data = "Pos.	No.	Driver	Hometown	Points	Gap	Starts	Wins	Top 5s	Top 10s'\n'0   T1B Transfer1 FromBMain na, NA  0   0   0   0   0'\n'1	2	David Gravel	Watertown, CT	4098		29	8	24	28'\n'2	83	Michael Kofoid	Penngrove, CA	3948	-150	29	4	11	24'\n'3	41	Carson Macedo	LeMoore, CA	3922	-176	29	4	16	24"

# used https://worldofoutlaws.com/series-points/ to get the driver data

def parse_driver_data(file_content: str) -> List[Driver]:
  lines = file_content.split('\n')
  drivers = []
  
  for line in lines:
    # Skip empty lines and comment lines
    if not line.strip() or line.startswith('//'):
      continue
    
    # Skip the header line
    if line.startswith('Pos.'):
      continue

    # Using regex pattern to match position, number, name, and hometown
    # Updated pattern to handle T4E style transfer numbers
    match = re.match(r'^\d+\s+(T?\d+\w*)\s+([^,]+)\s+([^,]+,\s*[A-Z]{2})', line)
    if not match:
      continue
    
    car_number, name, hometown = match.groups()
    name_parts = name.strip().split(' ')
    
    # Handle transfer drivers (names like "Transfer4 FromBMain")
    if name.startswith('Transfer'):
      first_name = name_parts[0] if name_parts else ''
      last_name = ' '.join(name_parts[1:]) if len(name_parts) > 1 else ''
    else:
      first_name = name_parts[0] if name_parts else ''
      last_name = ' '.join(name_parts[1:])
    
    drivers.append({
      'last_name': last_name,
      'first_name': first_name,
      'suffix': '',
      'car_number': car_number,
      'hometown': hometown.strip()
    })
  
  return drivers



def main():
  with open(filepath, 'r') as file:
    file_content = file.read()
  
  drivers = parse_driver_data(file_content)

  # save the drivers to new file called exportedDrivers.ts, with export const drivers = [<insert drivers jsons> ]
  with open('src/data/drivers.ts', 'w') as file:
    file.write('export const drivers = [\n')
    for driver in drivers:
      # Convert Python dict to TypeScript object format
      driver_str = f'  {{\n    last_name: "{driver["last_name"]}",\n    first_name: "{driver["first_name"]}",\n    suffix: "{driver["suffix"]}",\n    car_number: "{driver["car_number"]}",\n    hometown: "{driver["hometown"]}"\n  }}'
      file.write(driver_str + ',\n')
    file.write('];')

# run main 
if __name__ == "__main__":
  main()