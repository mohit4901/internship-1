import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Card, CardContent } from './card';

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ariaLabel,
  ariaLive = 'off',
  ariaRole = 'marquee',
  ...props
}) {
  const marqueeRef = useRef(null);

  return (
    <div
      {...props}
      ref={marqueeRef}
      data-slot="marquee"
      className={cn(
        'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className,
      )}
      aria-label={ariaLabel}
      aria-live={ariaLive}
      role={ariaRole}
      tabIndex={0}
    >
      {React.useMemo(
        () => (
          <>
            {Array.from({ length: repeat }, (_, i) => (
              <div
                key={i}
                className={cn(
                  !vertical ? 'flex-row [gap:var(--gap)]' : 'flex-col [gap:var(--gap)]',
                  'flex shrink-0 justify-around',
                  !vertical && 'animate-marquee flex-row',
                  vertical && 'animate-marquee-vertical flex-col',
                  pauseOnHover && 'group-hover:[animation-play-state:paused]',
                  reverse && '[animation-direction:reverse]',
                )}
              >
                {children}
              </div>
            ))}
          </>
        ),
        [repeat, children, vertical, pauseOnHover, reverse],
      )}
    </div>
  );
}

// Unique reviews data for Olympiad students
const testimonials = [
  {
    name: 'Aarav Sharma',
    username: '@aarav.sharma',
    body: 'Secured AIR 3 in the Senior Division! The Python ML prep modules were extremely detailed.',
    img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80',
    country: '🇮🇳 India',
  },
  {
    name: 'Priya Patel',
    username: '@priya.patel',
    body: 'The Junior Division logical reasoning tests were a game changer for my school computer science exam.',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80',
    country: '🇮🇳 India',
  },
  {
    name: 'Ishaan Verma',
    username: '@ishaan.v',
    body: 'Rigorous proctoring at physical centers. The Masters Division testing format was highly professional.',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80',
    country: '🇮🇳 India',
  },
  {
    name: 'Ananya Iyer',
    username: '@ananya_iyer',
    body: 'Loved the competition layout! Getting the rank certificate and cash rewards was a huge milestone.',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80',
    country: '🇮🇳 India',
  },
  {
    name: 'Kabir Mehta',
    username: '@mehta.kabir',
    body: 'Best national-level AI benchmarking platform. The syllabus challenges algorithmic logic, not memorization.',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80',
    country: '🇮🇳 India',
  },
  {
    name: 'Riya Sen',
    username: '@riya_sen',
    body: 'Extremely easy-to-use candidate portal. The mock kit reference materials prepared me perfectly.',
    img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80',
    country: '🇮🇳 India',
  },
];

function TestimonialCard({ img, name, username, body, country }) {
  return (
    <Card className="w-[260px] bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-colors duration-200">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar className="w-9 h-9">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <figcaption className="text-xs font-semibold text-slate-800 flex items-center gap-1.5 truncate">
              {name} <span className="text-[10px] grayscale-0">{country}</span>
            </figcaption>
            <p className="text-[10px] font-medium text-slate-400 truncate">{username}</p>
          </div>
        </div>
        <blockquote className="text-xs text-slate-500 leading-relaxed font-normal">
          &ldquo;{body}&rdquo;
        </blockquote>
      </CardContent>
    </Card>
  );
}

export function Testimonials3D() {
  return (
    <div className="relative flex h-full w-full flex-row items-center justify-center overflow-hidden [perspective:1000px] bg-slate-50/50">   <div
      className="flex flex-row items-center gap-4 shrink-0"
      style={{
        transform:
          'translateX(0px) translateY(0px) translateZ(-100px) ',
      }}
    >
      {/* Vertical Marquee (downwards) */}
      <Marquee vertical pauseOnHover repeat={3} className="[--duration:35s]">
        {testimonials.map((review, idx) => (
          <TestimonialCard key={`${review.username}-v1-${idx}`} {...review} />
        ))}
      </Marquee>
      {/* Vertical Marquee (upwards) */}
      <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:35s]">
        {testimonials.map((review, idx) => (
          <TestimonialCard key={`${review.username}-v2-${idx}`} {...review} />
        ))}
      </Marquee>
      {/* Vertical Marquee (upwards) */}
      <Marquee vertical pauseOnHover repeat={3} className="[--duration:35s]">
        {testimonials.map((review, idx) => (
          <TestimonialCard key={`${review.username}-v3-${idx}`} {...review} />
        ))}
      </Marquee>
      {/* Vertical Marquee (upwards) */}
      <Marquee vertical pauseOnHover reverse repeat={3} className="[--duration:35s]">
        {testimonials.map((review, idx) => (
          <TestimonialCard key={`${review.username}-v4-${idx}`} {...review} />
        ))}
      </Marquee>
    </div>

      {/* Gradient overlays for vertical marquee */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white to-transparent"></div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white to-transparent"></div>
    </div>
  );
}
