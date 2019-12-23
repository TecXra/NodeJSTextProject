import matplotlib.pyplot as plt
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

def process_and_plot(test_file):
    #y, x = getresults(test_file) # function which returns results on image file
    y, x = [2, 4, 3], [0, 1, 2]

    y_pos = range(len(y))
    plt.figure(num=1,figsize=(20,10))
    plt.title(test_file)
    plt.bar(y_pos, y, align='center')
    plt.xticks(y_pos, x)
    plt.pause(.001)

# to trigger the proess_and_plt function when a new file comes in directory 

class ExampleHandler(FileSystemEventHandler):
    def on_created(self, event):
        print event.src_path
        process_and_plot(event.src_path)

event_handler = ExampleHandler()
observer = Observer()
observer.schedule(event_handler, path='fakefolder/')
observer.start()
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    observer.stop()

observer.join()