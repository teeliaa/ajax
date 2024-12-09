$(document).ready(function () {
  let currentSlide = 0;

  function showSlide(index) {
    const slides = $('.slides');
    const totalSlides = slides.children().length;

    currentSlide = (index + totalSlides) % totalSlides;
    slides.css('transform', `translateX(-${currentSlide * 100}%)`);
  }

  setInterval(() => {
    showSlide(currentSlide + 1);
  }, 3000);

  // YouTube API를 통해 동영상 로드
  function loadYouTubeVideo(videoId, containerId) {
    new YT.Player(containerId, {
      height: '450',
      width: '800',
      videoId: videoId,
      events: {
        onReady: (event) => {
          console.log('YouTube Video Loaded:', videoId);
        },
        onError: (event) => {
          console.error('YouTube API Error:', event.data);
        }
      }
    });
  }

  window.loadContent = function (src) {
    const slides = $('.slides');
    const leftSection = $('.left');
    const rightSection = $('#content');

    // 슬라이드 숨기기
    slides.hide();

    // Ajax로 콘텐츠 로드
    $.ajax({
      url: src,
      dataType: 'html',
      success: function (data) {
        const content = $(`<div class="scoped-style">${data}</div>`);
        rightSection.html(content);

        // YouTube 동영상 ID를 data-video-id 속성에서 가져와 로드
        content.find('[data-video-id]').each(function () {
          const videoId = $(this).data('video-id');
          const containerId = $(this).attr('id');
          if (videoId && containerId) {
            loadYouTubeVideo(videoId, containerId);
          }
        });

        // 스크립트를 수동으로 실행
        content.find('script').each(function () {
          const script = document.createElement('script');
          script.text = $(this).text();
          document.head.appendChild(script).parentNode.removeChild(script);
        });
      },
      error: function () {
        rightSection.html('<p>컨텐츠를 로드하는 중 오류가 발생했습니다.</p>');
      }
    });

    leftSection.show();
    rightSection.show();
  };

  window.loadFullSection = function (src) {
    const leftSection = $('.left');
    const rightSection = $('.right');
    const container = $('.container');
    const contentSection = $('#content');

    // 모든 섹션 숨기기
    leftSection.hide();
    rightSection.hide();
    container.hide();

    // Ajax로 콘텐츠 로드 (풀 섹션 용)
    $.ajax({
      url: src,
      dataType: 'html',
      success: function (data) {
        const content = $(`<div class="scoped-style">${data}</div>`);
        contentSection.html(content).show();

        // YouTube 동영상 ID를 data-video-id 속성에서 가져와 로드
        content.find('[data-video-id]').each(function () {
          const videoId = $(this).data('video-id');
          const containerId = $(this).attr('id');
          if (videoId && containerId) {
            loadYouTubeVideo(videoId, containerId);
          }
        });

        // 스크립트를 수동으로 실행
        content.find('script').each(function () {
          const script = document.createElement('script');
          script.text = $(this).text();
          document.head.appendChild(script).parentNode.removeChild(script);
        });
      },
      error: function () {
        contentSection.html('<p>컨텐츠를 로드하는 중 오류가 발생했습니다.</p>');
      }
    });

    $('html, body').css('overflow', 'hidden');
  };

  window.showHome = function () {
    const leftSection = $('.left');
    const rightSection = $('.right');
    const slides = $('.slides');

    leftSection.show();
    rightSection.show();
    slides.show();

    $('html, body').css('overflow', 'auto');
  };
});


