import React, {useState, useEffect} from 'react';
import Footer from '@/components/Footer';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { AnimeNavBar } from '@/components/ui/anime-navbar';
import { Home, Info, Users, Award } from 'lucide-react';
import {
  CalendarBody,
  CalendarDate,
  CalendarDatePagination,
  CalendarDatePicker,
  CalendarHeader,
  CalendarItem,
  CalendarMonthPicker,
  CalendarProvider,
  CalendarYearPicker,
} from "@/components/ui/calendar-new";
import type { Feature } from "@/components/ui/calendar-new";

const navItems = [
  { name: 'Home', to: '/', icon: Home },
  { name: 'Information', to: '/information', icon: Info },
  { name: 'Council', to: '/council', icon: Users },
  { name: 'Awards', to: '/awards', icon: Award },
];

const eventStatuses = [
  { id: "1", name: "Registration", color: "#3B82F6" },
  { id: "2", name: "Deadline", color: "#EF4444" },
  { id: "3", name: "Event", color: "#10B981" },
  { id: "4", name: "Meeting", color: "#F59E0B" },
];

const createFeaturesFromEvents = (): Feature[] => {
  const events: Record<string, Array<{ title: string; statusId: string }>> = {
    '2025-09-01': [{ title: 'Competitive Events Guidelines Release', statusId: '3' }],
    '2025-09-02': [{ title: 'Fall Stock Market Game/LifeSmarts Registration', statusId: '1' }],
    '2025-09-24': [{ title: 'Champion Chapter Summer Starter', statusId: '3' }],
    '2025-09-25': [{ title: 'Champion Chapter: Shaping Success Begins', statusId: '3' }],
    '2025-09-26': [{ title: 'New Advisor Training', statusId: '4' }],
    '2025-10-01': [{ title: 'VBC Registration Opens', statusId: '1' }],
    '2025-10-03': [{ title: 'Committee Applications Due', statusId: '2' }],
    '2025-10-06': [{ title: 'Fall Stock Market Game Begins', statusId: '3' }],
    '2025-10-07': [{ title: 'NFLC Registration', statusId: '1' }],
    '2025-10-13': [{ title: 'Fall LifeSmarts Challenge Begins', statusId: '3' }],
    '2025-10-14': [{ title: 'Fall VBC Begins', statusId: '3' }],
    '2025-10-15': [{ title: 'ACTE Student Award App Deadline', statusId: '2' }],
    '2025-10-24': [{ title: 'Stock Market Game Reg. Close', statusId: '2' }],
    '2025-10-28': [{ title: 'SFLC', statusId: '3' }],
    '2025-11-05': [{ title: 'Champion Chapter: Shaping Success Deadline', statusId: '2' }],
    '2025-11-06': [{ title: 'Champion Chapter: Service Season Begins', statusId: '3' }],
    '2025-11-07': [{ title: 'NFLC and Fall VBC/LifeSmarts Challenge End', statusId: '3' }],
    '2025-11-08': [{ title: 'NFLC', statusId: '3' }],
    '2025-11-15': [{ title: 'Dressed to Impress Scholarship', statusId: '2' }],
    '2025-11-21': [{ title: 'Regional Competitive Events', statusId: '3' }],
    '2025-12-03': [{ title: 'Regional Events Testing', statusId: '3' }],
    '2025-12-12': [{ title: 'Fall Stock Market Game Ends', statusId: '3' }],
    '2026-01-20': [{ title: 'SLC Registration Deadline', statusId: '2' }],
    '2026-01-27': [{ title: 'SLC Prejudged Deadline', statusId: '2' }],
    '2026-02-09': [{ title: 'SLC Testing Day 1', statusId: '3' }],
    '2026-02-10': [{ title: 'SLC Testing Day 2', statusId: '3' }],
    '2026-02-11': [{ title: 'SLC Testing Day 3', statusId: '3' }],
    '2026-03-09': [{ title: 'SLC Day 1', statusId: '3' }],
    '2026-03-10': [{ title: 'SLC Day 2', statusId: '3' }],
    '2026-03-11': [{ title: 'SLC Day 3', statusId: '3' }],
    '2026-06-29': [{ title: 'NLC Day 1', statusId: '3' }],
    '2026-07-01': [{ title: 'NLC Day 3', statusId: '3' }],
    '2026-07-02': [{ title: 'NLC Day 4', statusId: '3' }]
  };

  let idCounter = 1;
  const features: Feature[] = [];

  Object.entries(events).forEach(([dateStr, eventList]) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const eventDate = new Date(year, month - 1, day);

    eventList.forEach((event) => {
      const status = eventStatuses.find(s => s.id === event.statusId) || eventStatuses[0];
      features.push({
        id: String(idCounter++),
        name: event.title,
        startAt: eventDate,
        endAt: eventDate,
        status: status,
      });
    });
  });

  return features;
};

const calendarFeatures = createFeaturesFromEvents();
const earliestYear = 2025;
const latestYear = 2026;

const fblaWeekSchedule = [
  { day: "Feb 11", title: "Service Sunday", description: "Encourage chapters to complete community service projects and fulfill one of the tenets of FBLA's mission. We will also share the total amount of money raised as part of the fundraising competition that took place before FBLA Week.", color: "from-emerald-500/20 to-teal-600/20", borderColor: "border-emerald-500/30", iconColor: "text-emerald-400" },
  { day: "Feb 12", title: "Mentor Monday", description: "Celebrate the importance of mentors who enrich the experiences of FBLA members. Programs or events that your chapter hosts on this day should highlight the role of mentors in a student's FBLA experience. FBLA will host a career panel webinar at 7:30 PM ET about the important role mentors play as students enter the workforce.", color: "from-blue-500/20 to-indigo-600/20", borderColor: "border-blue-500/30", iconColor: "text-blue-400" },
  { day: "Feb 13", title: "Tuesday Talks", description: "Connect with current National Officers, past officers, and other FBLA members through fun and unique programming, including a Battle of the Regions game night and Collegiate Conversations. Members will have the chance to network with other FBLA members in their region and the National Officers and then compete in a Battle of the Regions game night at 7:00 PM ET.", color: "from-purple-500/20 to-violet-600/20", borderColor: "border-purple-500/30", iconColor: "text-purple-400" },
  { day: "Feb 14", title: "Why Wednesday", description: "Preview the rest of the program year, including the National Leadership Conference (NLC) in June in Orlando and other National Officer programs through the National Presidents' Forum. Encourage members to share \"why\" they are involved in FBLA on social media using the hashtag #FBLAWeek.", color: "from-pink-500/20 to-rose-600/20", borderColor: "border-pink-500/30", iconColor: "text-pink-400" },
  { day: "Feb 15", title: "Thankful Thursday", description: "Thank local chapter advisers and state leaders by sharing videos and/or photos on social media. Members will thank advisers and state leaders for their commitment to the organization by posting stories, photos, and/or videos to their Instagram accounts using the hashtag #FBLAWeek.", color: "from-amber-500/20 to-orange-600/20", borderColor: "border-amber-500/30", iconColor: "text-amber-400" },
  { day: "Feb 16", title: "Future Friday", description: "Prepare FBLA members for their future by encouraging them to dress in professional attire, connect with industry professionals, research possible careers, and complete informational interviews.", color: "from-cyan-500/20 to-sky-600/20", borderColor: "border-cyan-500/30", iconColor: "text-cyan-400" },
  { day: "Feb 17", title: "Success Saturday", description: "End FBLA Week with a celebration of your chapter's accomplishments by tagging @fbla_national on Instagram and using the hashtag #FBLAWeek.", color: "from-lime-500/20 to-green-600/20", borderColor: "border-lime-500/30", iconColor: "text-lime-400" }
];

const Information: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white overflow-y-scroll">
      <AnimeNavBar items={navItems} visible />
      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto py-8 px-6">
          <h1 className="text-3xl font-semibold mb-4 mt-12 text-white">Information</h1>
          <section>
            <h2 className="text-xl font-medium text-white/90">What FBLA Does</h2>
            <p className="text-white/60 mt-2">Edison Academy FBLA builds leadership, career readiness, and competitive skills. We meet to prepare for events, run community projects, and provide member resources.</p>
          </section>
        </div>

        <div className={`w-full max-w-7xl mx-auto mt-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <div className="relative rounded-xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-sm shadow-lg">
            <div className="bg-slate-900/80 backdrop-blur-md w-full">
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-md bg-blue-500/20 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-sm bg-blue-400"></div>
                  </div>
                  <span className="text-white font-medium">FBLA Calendar</span>
                </div>
              </div>
              <div className="w-full flex justify-center p-6">
                <CalendarProvider className="w-full">
                  <CalendarDate>
                    <CalendarDatePicker>
                      <CalendarMonthPicker />
                      <CalendarYearPicker start={earliestYear} end={latestYear} />
                    </CalendarDatePicker>
                    <CalendarDatePagination />
                  </CalendarDate>
                  <CalendarHeader />
                  <CalendarBody features={calendarFeatures}>
                    {({ feature }) => <CalendarItem key={feature.id} feature={feature} />}
                  </CalendarBody>
                </CalendarProvider>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto py-12 px-6">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-6">FBLA Week Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {fblaWeekSchedule.slice(0, 4).map((item, index) => (
                <div key={index} className={`relative overflow-hidden rounded-2xl border ${item.borderColor} bg-gradient-to-br ${item.color} backdrop-blur-md p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
                  <div className="absolute top-0 right-0 p-3">
                    <span className={`text-xs font-bold ${item.iconColor} bg-black/20 px-2 py-1 rounded-full`}>{item.day}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-4 mb-2">{item.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {fblaWeekSchedule.slice(4, 7).map((item, index) => (
                <div key={index + 4} className={`relative overflow-hidden rounded-2xl border ${item.borderColor} bg-gradient-to-br ${item.color} backdrop-blur-md p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
                  <div className="absolute top-0 right-0 p-3">
                    <span className={`text-xs font-bold ${item.iconColor} bg-black/20 px-2 py-1 rounded-full`}>{item.day}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mt-4 mb-2">{item.title}</h3>
                  <p className="text-sm text-white/70 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">Events Participated In</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-sm">
                <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                  <Award className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">State & National Conference</h3>
                <p className="text-sm text-white/60">Compete at the State Leadership Conference and advance to the National Leadership Conference in Orlando, Florida.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-sm">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Business Competitions</h3>
                <p className="text-sm text-white/60">Participate in VBC, Stock Market Game, LifeSmarts Challenge, and other competitive events throughout the year.</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur-sm">
                <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                  <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Presentations & Tests</h3>
                <p className="text-sm text-white/60">Showcase your skills through business presentations, objective tests, and performance events at regional and state levels.</p>
              </div>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-white mb-4">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="faq-1" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-white/80">How do I start a BAA award?</AccordionTrigger>
                <AccordionContent className="text-white/60">
                  Paid members can start an award simply by registering for the award in the Learning Center (found on FBLA's national website). If you are uncertain how to register for an award, watch the orientation video on the home screen of the Learning Center.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-2" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-white/80">How do I register for FBLA?</AccordionTrigger>
                <AccordionContent className="text-white/60">
                  This club is one of the biggest ones at our school! In order to join, go to the Membership page on this website and sign up using the Google form. Next, make sure to join the Google Classroom so you can receive all information and notifications from the council. Last but not least, remember to pay your dues!
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-3" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-white/80">How many FBLA competitive events are there?</AccordionTrigger>
                <AccordionContent className="text-white/60">
                  There are over 70+ FBLA competitive events for you to choose from! They range anywhere from STEM-related events to debate and public speaking related events.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-4" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-white/80">Are seniors, juniors, sophomores, and freshmen competing in the same events?</AccordionTrigger>
                <AccordionContent className="text-white/60">
                  This depends. Certain events, called "Introduction to [topic name]," are exclusively for freshmen and sophomores. Other events that don't start with this phrase are open to all grade levels.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-5" className="border-white/10">
                <AccordionTrigger className="text-white hover:text-white/80">Who moves onto states, and then nationals?</AccordionTrigger>
                <AccordionContent className="text-white/60">
                  The top 8 in the region advance to the state contest, and the top 4 in the state advance to the national competition in each respective competition.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Information;
